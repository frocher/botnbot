# == Schema Information
#
# Table name: subscriptions
#
#  id         :bigint           not null, primary key
#  auth       :string(255)      not null
#  endpoint   :string(255)      not null
#  p256dh     :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :integer          not null
#

class Subscription < ApplicationRecord
  belongs_to :user

  validates :endpoint, presence: true
end
