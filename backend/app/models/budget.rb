# == Schema Information
#
# Table name: budgets
#
#  id         :bigint           not null, primary key
#  budget     :integer          default(0), not null
#  category   :integer          default(0), not null
#  item       :integer          default(0), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  page_id    :integer          not null
#
# Indexes
#
#  index_budgets_on_page_id  (page_id)
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
    super({ only: [:id, :category, :item, :budget, :created_at, :updated_at] }.merge(options || {}))
  end
end
