Rails.application.routes.draw do
  mount Rails::Monitor::Engine => "/rails-monitor"
end
