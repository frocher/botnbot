Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :environment, only: [:index]

  resources :pages do
    scope module: :pages do
      resources :assets, only: [:index, :show]
      resources :lighthouse, only: [:index, :show]
      resources :budgets, only: [:index, :create, :destroy]
      resources :members, except: :show
      resources :stats, only: [:index]
      resources :uptime, only: [:index, :show]
    end
  end

  resources :plans, only: [:index]

  resources :users, only: [:show, :update] do
    scope module: :users do
      resource :subscription
    end
  end

  get "/pages/:id/screenshot" => "pages#screenshot"
  post "/users/:id/save-subscription" => "users#save_subscription"
end
