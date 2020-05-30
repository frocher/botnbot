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

  resources :users, only: [:show, :update] do
    scope module: :users do
      resource :subscription, except: :create
    end
  end

  get "/pages/:id/screenshot" => "pages#screenshot"
  post "/users/:id/save-subscription" => "users#save_subscription"

  unless Figaro.env.stripe_secret_key.blank?
    post "/stripe/session" => "stripe#create_session"
    post Figaro.env.stripe_wh_path => "stripe#checkout_completed"
  end
end
