class EnvironmentController < ApplicationController
  def index
    resu = Hash.new
    resu["pushKey"] = Figaro.env.push_public_key
    resu["stripeKey"] = Figaro.env.stripe_public_key
    render json: resu
  end
end
