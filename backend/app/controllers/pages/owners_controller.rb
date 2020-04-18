class Pages::OwnersController < ApplicationController
  before_action :authenticate_user!

  def show
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :read_page_owner, @page)
    render json: @page.owner
  end

  def update
    @page = Page.find(params[:page_id])
    return not_found! unless can?(current_user, :update_page_owner, @page)
    @member = PageMember.find(params[:member_id])

    begin
      @page.owner = @member.user
      @page.save!
      render json: @page.owner
    rescue ActiveRecord::RecordInvalid
      render json: {errors: @page.errors}, status: 422
    end
  end
end
