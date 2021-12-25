class AddWeeklyReportToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :weekly_report, :boolean, default: true
  end
end
