class AddUptimeStatusToPages < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :uptime_status, :integer, default: 1
  end
end
