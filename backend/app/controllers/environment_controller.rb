class EnvironmentController < ApplicationController
  def index
    resu = Hash.new
    resu["pushKey"] = ENV["PUSH_PUBLIC_KEY"]
    resu["stripeKey"] = ENV["STRIPE_PUBLIC_KEY"]
    render json: resu
  end
end
