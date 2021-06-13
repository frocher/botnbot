class AddDowntimeToPage < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :last_downtime, :datetime
  end
end
