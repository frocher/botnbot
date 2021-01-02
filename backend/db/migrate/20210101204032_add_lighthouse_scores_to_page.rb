class AddLighthouseScoresToPage < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :last_week_lh_score, :integer
    add_column :pages, :current_week_lh_score, :integer
  end
end
