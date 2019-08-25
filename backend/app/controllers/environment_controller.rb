class EnvironmentController < ApplicationController
  def index
    resu = Hash.new
    resu["GOOGLE_ANALYTICS_KEY"] = Figaro.env.google_analytics_key
    resu["PUSH_KEY"] = Figaro.env.push_public_key
    resu["STRIPE_KEY"] = Figaro.env.stripe_public_key
    render json: resu
  end
end
