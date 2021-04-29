# == Schema Information
#
# Table name: pages
#
#  id                      :integer          not null, primary key
#  name                    :string
#  url                     :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  screenshot_file_name    :string
#  screenshot_content_type :string
#  screenshot_file_size    :integer
#  screenshot_updated_at   :datetime
#  uptime_keyword          :string
#  uptime_keyword_type     :string
#  slack_webhook           :string
#  slack_channel           :string
#  mail_notify             :boolean          default(TRUE)
#  slack_notify            :boolean          default(FALSE)
#
class PagesController < ApplicationController
  before_action :authenticate_user!, except: [:screenshot]
  before_action :set_page, only: [:show, :update, :destroy]

  def index
    if current_user.is_admin? && params[:admin] == 'true'
      @pages = paginate(Page.all)
    else
      @pages = paginate(@resource.pages)
    end
    render json: @pages
  end

  def show
    return not_found! unless can?(current_user, :read_page, @page)

    render_page
  end

  def create
    # Check subscription rights
    return render_api_error!("Your current subscription doesn't allow you to create more pages", 403) unless can_create_page

    Page.transaction do
      @page = Page.new
      @page.owner = current_user
      @page.name = params[:name]
      @page.url = params[:url]
      @page.description = params[:description]
      @page.device = params[:device]
      @page.uptime_status = 1
      @page.locked = false
      @page.uptime_keyword = ''
      @page.uptime_keyword_type = 'presence'
      @page.mail_notify = true
      @page.push_notify = true
      @page.slack_notify = false
      @page.slack_webhook = ''
      @page.slack_channel = ''
      @page.save!

      member = PageMember.new
      member.page = @page
      member.user = current_user
      member.role = :admin
      member.save!

      render_page
    rescue ActiveRecord::RecordInvalid
      render json: { errors: @page.errors }, status: 422
    end
  end

  def update
    return not_found! unless can?(current_user, :update_page, @page)

    @page.name = params[:name]
    @page.url = params[:url]
    @page.description = params[:description]
    @page.device = params[:device]
    @page.uptime_keyword = params[:uptime_keyword]
    @page.uptime_keyword_type = params[:uptime_keyword_type]
    @page.mail_notify = params[:mail_notify] || true
    @page.push_notify = params[:push_notify] || true
    @page.slack_notify = params[:slack_notify] || false
    @page.slack_webhook = params[:slack_webhook] || ''
    @page.slack_channel = params[:slack_channel] || ''
    @page.save!

    render_page

  rescue ActiveRecord::RecordInvalid
    render json: { errors: @page.errors }, status: 422
  end

  def destroy
    return not_found! unless can?(current_user, :delete_page, @page)

    @page.destroy
    current_user.update_pages_lock
    render json: @page
  end

  def screenshot
    @page = Page.find(params[:id])
    style = if params.key?(:style)
              params[:style]
            else
              'original'
            end
    path = File.join(Rails.root, 'public', "screenshot_#{rand(6)}.jpg")
    path = @page.screenshot.path(style) if @page.screenshot.exists?
    data = File.read(path)
    send_data data, type: 'image/jpeg', disposition: 'inline'
  end

private
  def can_create_page
    resu = true
    unless ENV['STRIPE_PUBLIC_KEY'].blank?
      max_pages = current_user.stripe_subscription["pages"]
      resu = max_pages > 0 && current_user.owned_pages.count < max_pages
    end
    resu
  end

  def render_page
    can_edit = can?(current_user, :update_page, @page)
    can_delete = can?(current_user, :delete_page, @page)
    can_add_member = can?(current_user, :create_page_member, @page)
    can_update_member = can?(current_user, :update_page_member, @page)
    can_remove_member = can?(current_user, :delete_page_member, @page)
    can_create_budget = can?(current_user, :create_budget, @page)
    can_delete_budget = can?(current_user, :delete_budget, @page)

    render json: @page.as_json.merge({
        can_edit: can_edit,
        can_delete: can_delete,
        can_add_member: can_add_member,
        can_update_member: can_update_member,
        can_remove_member: can_remove_member,
        can_create_budget: can_create_budget,
        can_delete_budget: can_delete_budget
      })
  end

  def set_page
    @page = Page.find(params[:id])
  end

  def page_params
    params.require(:page).permit(:name, :url)
  end
end
