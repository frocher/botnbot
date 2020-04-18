# == Schema Information
#
# Table name: page_members
#
#  id         :bigint(8)        not null, primary key
#  user_id    :integer          not null
#  page_id    :integer          not null
#  role       :integer          default("guest"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class PageMember < ActiveRecord::Base
  enum role: {guest: 0, editor: 1, master: 2, admin: 3}

  belongs_to :user
  belongs_to :page

  validates :user, presence: true
  validates :page, presence: true
  validates :user_id, uniqueness: { scope: [:page_id], message: "already exists in page" }

  scope :guests,  ->  { where("role = :role", role: 0) }
  scope :editors, ->  { where("role = :role", role: 1) }
  scope :masters, ->  { where("role = :role", role: 2) }
  scope :admins,  ->  { where("role = :role", role: 3) }

  def username
    user.name
  end

  def is_owner?
    user.id == page.owner.id
  end

  def as_json(options={})
    h = super({only: [:id, :user_id, :role, :created_at, :updated_at]}.merge(options || {}))
    h[:isOwner] = is_owner?
    h[:email] = user.email
    h[:username] = user.name
    h
  end
end
