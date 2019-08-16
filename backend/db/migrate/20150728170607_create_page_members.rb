class CreatePageMembers < ActiveRecord::Migration[5.1]
  def change
    create_table :page_members do |t|
      t.integer  :user_id, null: false
      t.integer  :page_id, null: false
      t.integer  :role, default: 0, null: false

      t.timestamps null: false
    end

    add_index(:page_members, :user_id)
    add_index(:page_members, :page_id)
    add_index(:page_members, [:user_id, :page_id], unique: true)
  end
end
