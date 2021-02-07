class AddCustomerToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :customer, :string
  end
end
