# == Route Map
#
#                   Prefix Verb     URI Pattern                              Controller#Action
#         new_user_session GET      /auth/sign_in(.:format)                  devise_token_auth/sessions#new
#             user_session POST     /auth/sign_in(.:format)                  devise_token_auth/sessions#create
#     destroy_user_session DELETE   /auth/sign_out(.:format)                 devise_token_auth/sessions#destroy
#        new_user_password GET      /auth/password/new(.:format)             devise_token_auth/passwords#new
#       edit_user_password GET      /auth/password/edit(.:format)            devise_token_auth/passwords#edit
#            user_password PATCH    /auth/password(.:format)                 devise_token_auth/passwords#update
#                          PUT      /auth/password(.:format)                 devise_token_auth/passwords#update
#                          POST     /auth/password(.:format)                 devise_token_auth/passwords#create
# cancel_user_registration GET      /auth/cancel(.:format)                   devise_token_auth/registrations#cancel
#    new_user_registration GET      /auth/sign_up(.:format)                  devise_token_auth/registrations#new
#   edit_user_registration GET      /auth/edit(.:format)                     devise_token_auth/registrations#edit
#        user_registration PATCH    /auth(.:format)                          devise_token_auth/registrations#update
#                          PUT      /auth(.:format)                          devise_token_auth/registrations#update
#                          DELETE   /auth(.:format)                          devise_token_auth/registrations#destroy
#                          POST     /auth(.:format)                          devise_token_auth/registrations#create
#    new_user_confirmation GET      /auth/confirmation/new(.:format)         devise_token_auth/confirmations#new
#        user_confirmation GET      /auth/confirmation(.:format)             devise_token_auth/confirmations#show
#                          POST     /auth/confirmation(.:format)             devise_token_auth/confirmations#create
#      auth_validate_token GET      /auth/validate_token(.:format)           devise_token_auth/token_validations#validate_token
#             auth_failure GET      /auth/failure(.:format)                  users/omniauth_callbacks#omniauth_failure
#                          GET      /auth/:provider/callback(.:format)       users/omniauth_callbacks#omniauth_success
#                          GET|POST /omniauth/:provider/callback(.:format)   users/omniauth_callbacks#redirect_callbacks
#         omniauth_failure GET|POST /omniauth/failure(.:format)              users/omniauth_callbacks#omniauth_failure
#                          GET      /auth/:provider(.:format)                redirect(301)
#        environment_index GET      /environment(.:format)                   environment#index
#               page_owner GET      /pages/:page_id/owner(.:format)          pages/owners#show
#                          PATCH    /pages/:page_id/owner(.:format)          pages/owners#update
#                          PUT      /pages/:page_id/owner(.:format)          pages/owners#update
#             page_members GET      /pages/:page_id/members(.:format)        pages/members#index
#                          POST     /pages/:page_id/members(.:format)        pages/members#create
#              page_member PATCH    /pages/:page_id/members/:id(.:format)    pages/members#update
#                          PUT      /pages/:page_id/members/:id(.:format)    pages/members#update
#                          DELETE   /pages/:page_id/members/:id(.:format)    pages/members#destroy
#              page_assets GET      /pages/:page_id/assets(.:format)         pages/assets#index
#               page_asset GET      /pages/:page_id/assets/:id(.:format)     pages/assets#show
#    page_lighthouse_index GET      /pages/:page_id/lighthouse(.:format)     pages/lighthouse#index
#          page_lighthouse GET      /pages/:page_id/lighthouse/:id(.:format) pages/lighthouse#show
#             page_budgets GET      /pages/:page_id/budgets(.:format)        pages/budgets#index
#                          POST     /pages/:page_id/budgets(.:format)        pages/budgets#create
#              page_budget DELETE   /pages/:page_id/budgets/:id(.:format)    pages/budgets#destroy
#               page_stats GET      /pages/:page_id/stats(.:format)          pages/stats#index
#        page_uptime_index GET      /pages/:page_id/uptime(.:format)         pages/uptime#index
#              page_uptime GET      /pages/:page_id/uptime/:id(.:format)     pages/uptime#show
#                    pages GET      /pages(.:format)                         pages#index
#                          POST     /pages(.:format)                         pages#create
#                     page GET      /pages/:id(.:format)                     pages#show
#                          PATCH    /pages/:id(.:format)                     pages#update
#                          PUT      /pages/:id(.:format)                     pages#update
#                          DELETE   /pages/:id(.:format)                     pages#destroy
#                    plans GET      /plans(.:format)                         plans#index
#        user_subscription GET      /users/:user_id/subscription(.:format)   users/subscriptions#show
#                          PATCH    /users/:user_id/subscription(.:format)   users/subscriptions#update
#                          PUT      /users/:user_id/subscription(.:format)   users/subscriptions#update
#                          DELETE   /users/:user_id/subscription(.:format)   users/subscriptions#destroy
#                     user GET      /users/:id(.:format)                     users#show
#                          PATCH    /users/:id(.:format)                     users#update
#                          PUT      /users/:id(.:format)                     users#update
#                          DELETE   /users/:id(.:format)                     users#destroy
#                          GET      /pages/:id/screenshot(.:format)          pages#screenshot
#                          POST     /users/:id/save-subscription(.:format)   users#save_subscription

Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :environment, only: [:index]

  resources :pages do
    scope module: :pages do
      resource :owner, only: [:show, :update]
      resources :members, except: :show
      resources :assets, only: [:index, :show]
      resources :lighthouse, only: [:index, :show]
      resources :budgets, only: [:index, :create, :destroy]
      resources :stats, only: [:index]
      resources :uptime, only: [:index, :show]
    end
  end

  resources :plans, only: [:index]

  resources :users, only: [:show, :update, :destroy] do
    scope module: :users do
      resource :subscription, only: :show
    end
  end

  get "/pages/:id/screenshot" => "pages#screenshot"
  post "/users/:id/save-subscription" => "users#save_subscription"

  unless ENV["STRIPE_SECRET_KEY"].blank?
    post "/stripe/session" => "stripe#create_session"
    post "/stripe/customer_portal_session" => "stripe#create_customer_portal_session"

    path = ENV.fetch("STRIPE_WH_PATH") { "/stripe/checkout_completed" }
    post path => "stripe#hooks"
  end
end
