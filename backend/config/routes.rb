# == Route Map
#

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount_devise_token_auth_for 'User', at: 'auth', controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  resources :environment, only: [:index]

  resources :pages do
    scope module: :pages do
      resource :owner, only: [:show, :update]
      resources :members, except: :show
      resources :assets, only: [:index, :show]
      resources :carbon, only: [:index, :show]
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

  get '/pages/:id/screenshot' => 'pages#screenshot'
  post '/users/:id/save-subscription' => 'users#save_subscription'

  unless ENV['STRIPE_SECRET_KEY'].blank?
    post '/stripe/session' => 'stripe#create_session'
    post '/stripe/customer_portal_session' => 'stripe#create_customer_portal_session'

    path = ENV.fetch('STRIPE_WH_PATH') { '/stripe/checkout_completed' }
    post path => 'stripe#hooks'
  end
end
