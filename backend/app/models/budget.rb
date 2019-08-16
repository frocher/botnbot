# == Schema Information
#
# Table name: budgets
#
#  id         :bigint(8)        not null, primary key
#  page_id    :integer          not null
#  category   :integer          default(0), not null
#  item       :integer          default(0), not null
#  budget     :integer          default(0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Budget < ActiveRecord::Base
  belongs_to :page

  #
  # Validations
  #
  validates :category, presence: true
  validates :item, presence: true
  validates :budget, presence: true
  validates :page, presence: true

  def as_json(options={})
    super({only: [:id, :category, :item, :budget, :created_at, :updated_at]}.merge(options || {}))
  end
end
