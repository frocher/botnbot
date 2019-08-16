class CreatePages < ActiveRecord::Migration[5.1]
  def change
    create_table :pages do |t|

      t.string :name
      t.string :url

      t.timestamps null: false
    end
    add_attachment :pages, :screenshot
  end
end
