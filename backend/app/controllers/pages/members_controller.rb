class Pages::MembersController < ApplicationController
  before_action :authenticate_user!
  def index
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page_member, @page)
    render json: @page.page_members
  end

  def create
    @page = Page.find(params[:page_id])

    # Check abilities
    return not_found! unless can?(current_user, :create_page_member, @page)

    # Check subscription rights
    return render_api_error!("Your current subscription doesn't allow you to create more members", 403) unless can_create_member(@page)

    if params[:role] == "admin"
      return not_found! unless can?(current_user, :create_page_member_admin, @page)
    end

    # Check if user exists
    user = User.find_by email: params[:email]
    return render_api_error!("#{params[:email]} is not a registered user", 422) if user.nil?

    # Check if user is not already a member
    @member = PageMember.find_by user: user, page: @page
    return render_api_error!("#{params[:email]} is already a member", 422) unless @member.nil?

    begin
      @member = PageMember.new

      @member.role = convert_role(params[:role])
      @member.page = @page
      @member.user = user
      @member.save!

      render json: @member
    rescue ActiveRecord::RecordInvalid
      render json: {errors: @member.errors}, status: 422
    end

  end

  def update
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :update_page_member, @page)
    @member = PageMember.find(params[:id])

    # A member can't update his own rights
    return render_api_error!("You can't update your own role", 422) if @member.user.id == current_user.id

    # A member can't allow upper level rights to another member
    user_member = @page.page_members.find_by_user_id(current_user.id)
    role = convert_role(params[:role])
    return render_api_error!("You are not allowed to give the #{params[:role]} role", 422) if is_greater_role(role, user_member.role)

    # There must be at least one admin member remaining
    logger.error "Ah ah 1"
    if @member.role == "admin"
      logger.error "Ah ah 2"
      return render_api_error!("There must be at least one admin remaining", 422) unless has_a_remaining_admin(@page, @member)
    end

    begin
      @member.role = role
      @member.save!
      render json: @member
    rescue ActiveRecord::RecordInvalid
      render json: {errors: @member.errors}, status: 422
    end

  end

  def destroy
    @page = Page.find(params[:page_id])
    # If member id is <= 0, use the current user as a member
    if params[:id].to_i <= 0
      @member = @page.page_members.find_by_user_id(current_user.id)
    else
      @member = PageMember.find(params[:id])
    end

    if @member.user.id == current_user.id
      return not_found! unless can?(current_user, :leave_page, @page)
    else
      return not_found! unless can?(current_user, :delete_page_member, @page)
    end

    # A user can always remove himself as a page member except if he is the last
    # admin member
    return render_api_error!("There must be at least one admin remaining", 422) unless has_a_remaining_admin(@page, @member)

    begin
      @member.destroy!
      render json: @member
    rescue ActiveRecord::RecordInvalid
      render json: {errors: @member.errors}, status: 422
    end
  end

  private

  def can_create_member(page)
    resu = true
    if Figaro.env.stripe_public_key?
      max_members = current_user.stripe_subscription["members"]
      resu = max_members > 0 && page.members.count < max_members
    end
    resu
  end

  def has_a_remaining_admin(page, member)
    found_admin = false
    logger.error "Entrez ici"
    page.page_members.each do |current|
      logger.error current.to_s
      if current.id != member.id && current.role == "admin"
        found_admin = true
        break
      end
    end
    found_admin
  end

  def convert_role(role_name)
    case role_name
    when "admin"
      :admin
    when "master"
      :master
    when "editor"
      :editor
    else
      :guest
    end
  end

  def is_greater_role(role1, role2)
    prefix_role(role1.to_s) > prefix_role(role2.to_s)
  end

  def prefix_role(role)
    return "3" + role if role == "admin"
    return "2" + role if role == "master"
    return "1" + role if role == "editor"
    return "0"
  end

end
