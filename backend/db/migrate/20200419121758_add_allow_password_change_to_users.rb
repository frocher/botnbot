class AddAllowPasswordChangeToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :allow_password_change, :boolean, default: false, null: false
  end
end
