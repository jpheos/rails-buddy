# frozen_string_literal: true

Rails.application.routes.draw do
  get     'get',    to: 'examples#get'
  post    'post',   to: 'examples#post'
  put     'put',    to: 'examples#put'
  patch   'patch',  to: 'examples#patch'
  delete  'delete', to: 'examples#delete'

  resources :articles

  root to: 'examples#index'
end
