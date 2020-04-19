class EnvironmentController < ApplicationController
  def index
    resu = Hash.new
    resu["analyticsKey"] = Figaro.env.google_analytics_key
    resu["pushKey"] = Figaro.env.push_public_key
    resu["stripeKey"] = Figaro.env.stripe_public_key
    render json: resu
  end
end
