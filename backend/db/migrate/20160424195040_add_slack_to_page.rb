class AddSlackToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :slack_webhook, :string
    add_column :pages, :slack_channel, :string
  end
end
