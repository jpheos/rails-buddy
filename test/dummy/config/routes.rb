# frozen_string_literal: true

Rails.application.routes.draw do
  mount Rails::Buddy::Engine => '/rails-buddy'
end
