Rails::Monitor::Engine.routes.draw do
  resources :requests, only: [] do
    post :clear, on: :collection
  end

  root to: "/rails/monitor/requests#index"
end
