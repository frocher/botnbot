class AddLockedToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :locked, :boolean, default: false
  end
end
