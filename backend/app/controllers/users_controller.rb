# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  provider               :string           not null
#  uid                    :string           default(""), not null
#  admin                  :boolean          default(FALSE)
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string
#  last_sign_in_ip        :string
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  name                   :string
#  bio                    :string
#  email                  :string
#  tokens                 :text
#  created_at             :datetime
#  updated_at             :datetime
#

class UsersController < ApplicationController
  before_action :set_user

  def show
    return not_found! unless can?(current_user, :show_user, @user)
    render json: @user
  end

  def update
    return not_found! unless can?(current_user, :update_user, @user)

    @user.name = params[:name]
    @user.bio  = params[:bio]
    @user.save!

    render json: @user

  rescue ActiveRecord::RecordInvalid
    render json: {errors: @user.errors}, status: 422
  end

  def save_subscription
    return not_found! unless can?(current_user, :update_user, @user)

    if (!params[:subscription])
      render json: {message: "Subscription must have an endpoint."}, status: 400
    else
      hash = JSON.parse(params[:subscription])

      @subscription = Subscription.new
      @subscription.endpoint = hash["endpoint"]
      @subscription.p256dh = hash["keys"]["p256dh"]
      @subscription.auth = hash["keys"]["auth"]
      @subscription.user = @user
      @subscription.save!

      render json: @subscription
    end
  end

  private

  def set_user
    if params[:id].to_i <= 0
      @user = current_user
    else
      @user = User.find(params[:id])
    end
  end

end
