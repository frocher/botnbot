class Users::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
  def get_resource_from_auth_hash
    @resource = resource_class.from_omniauth(auth_hash)
    @oauth_registration = true if @resource.new_record?
    @resource
  end

  def omniauth_failure
    redirect_to "#{request.env['omniauth.origin']}?message=Access%20denied"
  end
end
