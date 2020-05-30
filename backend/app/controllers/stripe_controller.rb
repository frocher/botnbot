require "stripe"

class StripeController < ApplicationController
  before_action :authenticate_user!, only: [:create_session]

  def create_session
    Stripe.api_key = Figaro.env.stripe_secret_key

    session = Stripe::Checkout::Session.create(
      client_reference_id: current_user.id,
      customer_email:  current_user.email,
      payment_method_types: ["card"],
      line_items: [{
        price: params[:price_id],
        quantity: 1,
      }],
      mode: "subscription",
      success_url: Figaro.env.stripe_success_url,
      cancel_url: Figaro.env.stripe_error_url,
    )
    render json: { id: session.id }
  end

  def checkout_completed
    Stripe.api_key = Figaro.env.stripe_secret_key
    endpoint_secret = Figaro.env.stripe_wh_secret

    payload = request.body.read
    event = nil

    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, endpoint_secret
      )
    rescue JSON::ParserError => e
      bad_request!
      return
    rescue Stripe::SignatureVerificationError => e
      bad_request!
      return
    end

    if event['type'] == 'checkout.session.completed'
      session = event['data']['object']

      user = User.find(session.client_reference_id)
      user.subscription = session.subscription
      user.save!

      user.update_pages_lock
    end

    render json: { message: 'checkout completed'}
  end

end
