class CreateBudgets < ActiveRecord::Migration[5.1]
  def change
    create_table :budgets do |t|
      t.integer  :page_id, null: false
      t.integer  :category, default: 0, null: false
      t.integer  :item, default: 0, null: false
      t.integer  :budget, default: 0, null: false

      t.timestamps null: false
    end

    add_index(:budgets, :page_id)
  end
end
