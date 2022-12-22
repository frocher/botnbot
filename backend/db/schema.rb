# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_25_095322) do

  create_table "budgets", charset: "latin1", force: :cascade do |t|
    t.integer "page_id", null: false
    t.integer "category", default: 0, null: false
    t.integer "item", default: 0, null: false
    t.integer "budget", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["page_id"], name: "index_budgets_on_page_id"
  end

  create_table "identities", charset: "latin1", force: :cascade do |t|
    t.string "provider", null: false
    t.string "uid", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_identities_on_provider_and_uid", unique: true
  end

  create_table "page_members", charset: "latin1", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "page_id", null: false
    t.integer "role", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["page_id"], name: "index_page_members_on_page_id"
    t.index ["user_id", "page_id"], name: "index_page_members_on_user_id_and_page_id", unique: true
    t.index ["user_id"], name: "index_page_members_on_user_id"
  end

  create_table "pages", charset: "latin1", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "screenshot_file_name"
    t.string "screenshot_content_type"
    t.bigint "screenshot_file_size"
    t.datetime "screenshot_updated_at"
    t.string "uptime_keyword"
    t.string "uptime_keyword_type"
    t.string "slack_webhook"
    t.string "slack_channel"
    t.boolean "mail_notify", default: true
    t.boolean "slack_notify", default: false
    t.integer "uptime_status", default: 1
    t.boolean "push_notify", default: true
    t.integer "device", default: 0
    t.boolean "locked", default: false
    t.integer "owner_id", null: false
    t.integer "last_week_lh_score"
    t.integer "current_week_lh_score"
    t.datetime "last_downtime"
    t.string "description", default: ""
    t.index ["owner_id"], name: "index_pages_on_owner_id"
  end

  create_table "subscriptions", charset: "latin1", force: :cascade do |t|
    t.string "endpoint", null: false
    t.string "p256dh", null: false
    t.string "auth", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", charset: "latin1", force: :cascade do |t|
    t.string "provider", null: false
    t.string "uid", default: "", null: false
    t.boolean "admin", default: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "bio"
    t.string "email"
    t.text "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
    t.string "subscription"
    t.boolean "allow_password_change", default: false, null: false
    t.string "customer"
    t.boolean "weekly_report", default: true
    t.index ["email"], name: "index_users_on_email"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

end
