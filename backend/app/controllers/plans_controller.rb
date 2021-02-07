class PlansController < ApplicationController
  def index
    resu = []
    resu = Rails.application.config.stripe_plans unless ENV['STRIPE_PUBLIC_KEY'].blank?
    render json: resu
  end
end
