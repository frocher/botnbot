class AddPushNotificationToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :push_notify, :boolean, default: true
  end
end
