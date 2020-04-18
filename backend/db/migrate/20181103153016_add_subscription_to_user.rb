class AddSubscriptionToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :subscription, :string
  end
end
