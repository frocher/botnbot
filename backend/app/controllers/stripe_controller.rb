require "stripe"

class StripeController < ApplicationController
  before_action :authenticate_user!, only: [:create_session, :create_customer_portal_session]

  def create_session
    Stripe.api_key = ENV["STRIPE_SECRET_KEY"]

    session = nil
    if current_user.customer.blank?
      session = Stripe::Checkout::Session.create(
        client_reference_id: current_user.id,
        customer_email:  current_user.email,
        payment_method_types: ["card"],
        line_items: [{
          price: params[:price_id],
          quantity: 1,
        }],
        mode: "subscription",
        success_url: ENV["STRIPE_SUCCESS_URL"],
        cancel_url: ENV["STRIPE_ERROR_URL"],
      )
    else
      session = Stripe::Checkout::Session.create(
        client_reference_id: current_user.id,
        customer: current_user.customer,
        payment_method_types: ["card"],
        line_items: [{
          price: params[:price_id],
          quantity: 1,
        }],
        mode: "subscription",
        success_url: ENV["STRIPE_SUCCESS_URL"],
        cancel_url: ENV["STRIPE_ERROR_URL"],
      )
    end

    render json: { id: session.id }
  end

  def create_customer_portal_session
    Stripe.api_key = ENV["STRIPE_SECRET_KEY"]
    session = Stripe::BillingPortal::Session.create(
      customer: current_user.customer,
      return_url: ENV["STRIPE_RETURN_URL"]
    )
    render json: { url: session.url }
  end

  def hooks
    Stripe.api_key = ENV["STRIPE_SECRET_KEY"]
    endpoint_secret = ENV["STRIPE_WH_SECRET"]

    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil
    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, endpoint_secret
      )
    rescue JSON::ParserError => e
      logger.error ([e.message]+e.backtrace).join($/)
      bad_request!
      return
    rescue Stripe::SignatureVerificationError => e
      logger.error ([e.message]+e.backtrace).join($/)
      bad_request!
      return
    end

    logger.info("Stripe Event: " + event['type'])

    if event['type'] == 'checkout.session.completed'
      session = event['data']['object']
      user = User.find(session.client_reference_id)
      user.customer = session.customer
      user.subscription = session.subscription
      user.save!
    elsif event['type'] == 'customer.subscription.updated'
      session = event['data']['object']
      user = User.find_by(customer: session.customer)
      user.update_pages_lock      
    elsif event['type'] == 'customer.subscription.deleted'
      session = event['data']['object']
      user = User.find_by(customer: session.customer)
      user.subscription = nil
      user.save!

      user.update_pages_lock            
    end

    render json: { message: 'checkout completed'}
  end

end
