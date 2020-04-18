class PlansController < ApplicationController
  def index
    resu = Array.new
    unless Figaro.env.stripe_public_key.blank?
      resu = Rails.application.config.stripe_plans
    end
    render json: resu
  end
end
