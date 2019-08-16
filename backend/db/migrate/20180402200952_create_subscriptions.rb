class CreateSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :subscriptions do |t|
      t.string :endpoint, :null => false
      t.string :p256dh, :null => false
      t.string :auth, :null => false
      t.integer :user_id, null: false
      t.timestamps
    end
  end
end
