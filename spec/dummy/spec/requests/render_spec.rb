# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Renders' do
  describe 'GET /plain' do
    it 'returns http success' do
      get '/render/plain'
      expect(response).to have_http_status(:success)
    end

    it 'returns plain text' do
      get '/render/plain'
      expect(response.body).to eq('ok')
    end
  end

  describe 'GET /json' do
    it 'returns http success' do
      get '/render/json'
      expect(response).to have_http_status(:success)
    end

    it 'returns json' do
      get '/render/json'
      expect(response.body).to eq({ status: 'ok' }.to_json)
    end
  end

  describe 'GET /with_partial' do
    it 'returns http success' do
      get '/render/with_partial'
      expect(response).to have_http_status(:success)
    end

    it 'renders remplate with partial' do
      get '/render/with_partial'
      expect(response.body).to include('Partial first level').and include('Partial second level')
    end
  end

  describe 'GET /with_collection' do
    it 'returns http success' do
      get '/render/with_collection'
      expect(response).to have_http_status(:success)
    end

    it 'renders remplate with collection' do
      get '/render/with_collection'
      expect(response.body).to include('Partial first level').and include('Partial second level')
    end
  end

  describe 'GET /without_layout' do
    it 'returns http success' do
      get '/render/without_layout'
      expect(response).to have_http_status(:success)
    end

    it 'renders remplate without layout' do
      get '/render/without_layout'
      expect(response.body).not_to include('<html>')
    end
  end

  describe 'GET /partial_from_controller' do
    it 'returns http success' do
      get '/render/partial_from_controller'
      expect(response).to have_http_status(:success)
    end
  end
end
