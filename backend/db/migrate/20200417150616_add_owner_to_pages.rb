class AddOwnerToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :owner_id, :integer, null: false
    add_index(:pages, :owner_id)
  end
end
