class PlansController < ApplicationController
  def index
    resu = Array.new
    unless ENV["STRIPE_PUBLIC_KEY"].blank?
      resu = Rails.application.config.stripe_plans
    end
    render json: resu
  end
end
