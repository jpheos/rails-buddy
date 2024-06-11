Rails::Buddy::Engine.routes.draw do
  resources :requests, only: [:show] do
    post :clear, on: :collection
    get :close, on: :collection
  end

  root to: "/rails/buddy/requests#index"
end
