require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BnbNexus
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Only loads a smaller set of middleware suitable for API only apps.
    config.api_only = true

    # Array of probes for pages checks and measures
    config.probes = JSON.parse(ENV.fetch("PROBES") { '[{ "name":"localhost", "host":"localhost", "port":3333, "token":"helloman" }]' })

    # Array of stripe plans
    stripe_plans = ENV.fetch("STRIPE_PLANS") { [] }
    if stripe_plans.blank?
      stripe_plans = '[{ "id":-1, "name":"Free", "amount":0, "uptime":15, "pages":3, "members":3 }]'
    end
    config.stripe_plans = JSON.parse(stripe_plans)

    protocol  = ENV.fetch("HTTP_PROTOCOL") { "http" }
    http_host = ENV.fetch("HTTP_HOST") { "localhost" }
    http_port = ENV.fetch("HTTP_PORT") { "8081" }
    smtp_host = ENV.fetch("SMTP_HOST") { "localhost" }
    smtp_port = ENV.fetch("SMTP_PORT") { "1025" }
  
    # Assets
    config.asset_host = ENV.fetch("ASSET_HOST") { "#{protocol}://#{http_host}:#{http_port}" }
  
    # Mailer
    config.action_mailer.default_url_options = { host: http_host, port: http_port }
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = { address: smtp_host, port: smtp_port, enable_starttls_auto: false }
  
    # Omniauth middleware
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies # Required for all session management
    config.middleware.use ActionDispatch::Session::CookieStore, config.session_options

    config.to_prepare do
      Devise::Mailer.layout "mailer"
    end
  end
end
