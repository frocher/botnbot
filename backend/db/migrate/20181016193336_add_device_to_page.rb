class AddDeviceToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :device, :integer, default: 0
  end
end
