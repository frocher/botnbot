class AddDescriptionToPages < ActiveRecord::Migration[5.2]
  def change
    add_column :pages, :description, :string, default: ''
  end
end
