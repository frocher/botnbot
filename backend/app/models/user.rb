# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  provider               :string(255)      not null
#  uid                    :string(255)      default(""), not null
#  admin                  :boolean          default(FALSE)
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  confirmation_token     :string(255)
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string(255)
#  name                   :string(255)
#  bio                    :string(255)
#  email                  :string(255)
#  tokens                 :text(65535)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  image                  :string(255)
#

class User < ActiveRecord::Base
  include DeviseTokenAuth::Concerns::User

  devise :database_authenticatable, :registerable, :recoverable, :validatable, :confirmable, :trackable

  before_create :record_first_admin

  alias_attribute :nickname, :name

  has_many :page_members, dependent: :destroy
  has_many :pages, through: :page_members
  has_many :identities, dependent: :destroy
  has_many :subscriptions, dependent: :destroy

  # Scopes
  scope :admins, -> { where(admin: true) }

  #
  # Validations
  #
  validates :name, presence: true, uniqueness: true
  validates :bio, length: { maximum: 500 }, allow_blank: true

  def is_admin?
    admin
  end

  def avatar_url
    ApplicationController.helpers.avatar_icon(email)
  end


  #
  # Class methods
  #
  class << self
    def from_omniauth(auth)
      user = nil
      identity = Identity.where(provider: auth.provider, uid: auth.uid).first
      if identity
        user = identity.user
      else
        user = User.find_by(email: auth.info.email) || User.create!(uid: auth.uid, provider: auth.provider, email: auth.info.email, password: Devise.friendly_token[0,20], name: (auth.info.name || auth.info.full_name).to_s)
        identity = Identity.create(provider: auth.provider, uid: auth.uid, user: user)
      end
      user
    end

  end


  private

  # First user is always super admin
  def record_first_admin
    if User.count == 0
      self.admin = true
    end
  end

end
