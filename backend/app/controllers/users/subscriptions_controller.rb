require "stripe"

class Users::SubscriptionsController < ApplicationController
  before_action :set_user

  def show
    return not_found! unless can?(current_user, :read_subscription, @user)
    render json: @user.stripe_subscription
  end

  def create
    return not_found! unless can?(current_user, :create_subscription, @user)

    Stripe.api_key = Figaro.env.stripe_secret_key

    customer = Stripe::Customer.create(
      email: params[:stripeEmail],
      source: params[:stripeToken]
    )

    subscription = Stripe::Subscription.create({
      customer: customer.id,
      items: [{plan: params[:stripePlan]}]
    })

    @user.subscription = subscription.id
    @user.save!

    render json: @user.stripe_subscription
  end

  def update
    return not_found! unless can?(current_user, :update_subscription, @user)

    Stripe.api_key = Figaro.env.stripe_secret_key
    subscription = Stripe::Subscription.retrieve(@user.subscription)
    subscription.cancel_at_period_end = false
    subscription.items = [{
        id: subscription.items.data[0].id,
        plan: params[:stripePlan]
    }]
    subscription.save

    @user.update_pages_lock

    render json: @user.stripe_subscription
  end

  def destroy
    return not_found! unless can?(current_user, :delete_subscription, @user)

    Stripe.api_key = Figaro.env.stripe_secret_key
    subscription = Stripe::Subscription.retrieve(@user.subscription)
    subscription.delete

    @user.subscription = nil
    @user.save!

    @user.update_pages_lock

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
