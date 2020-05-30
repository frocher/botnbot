class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :add_abilities
  respond_to :json

  rescue_from ActiveRecord::RecordNotFound do
    render json: { message: '404 Not found'}, status: 404
    update_auth_header
  end

  rescue_from Exception do |exception|
    trace = exception.backtrace

    message = "\n#{exception.class} (#{exception.message}):\n"
    message << exception.annoted_source_code.to_s if exception.respond_to?(:annoted_source_code)
    message << "  " << trace.join("\n  ")

    logger.fatal message
    update_auth_header
    render json: { message: '500 Internal Server Error'}, status: 500
  end

 protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def abilities
    @abilities ||= Six.new
  end

  def can?(object, action, subject)
    abilities.allowed?(object, action, subject)
  end

  def add_abilities
    abilities << Ability
  end

  def authorize!(action, subject)
    unless abilities.allowed?(current_user, action, subject)
      forbidden!
    end
  end

  def bad_request!
    render_api_error!('400 Bad request', 400)
  end

  def forbidden!
    render_api_error!('403 Forbidden', 403)
  end

  def not_found!
    render_api_error!('404 Not found', 404)
  end

  def render_api_error!(message, status)
    render json: { message: message}, status: status
  end

  def paginate(relation)
    per_page  = params[:per_page].to_i
    paginated = relation.page(params[:page]).per(per_page)
    add_pagination_headers(paginated, per_page)

    paginated
  end

  def add_pagination_headers(paginated, per_page)
    request_url = request.url.split('?').first

    links = []
    links << %(<#{request_url}?page=#{paginated.current_page - 1}&per_page=#{per_page}>; rel="prev") unless paginated.first_page?
    links << %(<#{request_url}?page=#{paginated.current_page + 1}&per_page=#{per_page}>; rel="next") unless paginated.last_page?
    links << %(<#{request_url}?page=1&per_page=#{per_page}>; rel="first")
    links << %(<#{request_url}?page=#{paginated.total_pages}&per_page=#{per_page}>; rel="last")

    response.headers['Link'] = links.join(', ')
  end


end
