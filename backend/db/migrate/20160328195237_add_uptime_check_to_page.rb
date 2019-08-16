class AddUptimeCheckToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :uptime_keyword, :string
    add_column :pages, :uptime_keyword_type, :string
  end
end
