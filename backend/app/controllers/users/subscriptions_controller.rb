require "stripe"

class Users::SubscriptionsController < ApplicationController
  before_action :set_user

  def show
    return not_found! unless can?(current_user, :read_subscription, @user)
    render json: @user.stripe_subscription
  end

private

  def set_user
    if params[:user_id].to_i <= 0
      @user = current_user
    else
      @user = User.find(params[:user_id])
    end
  end
end
