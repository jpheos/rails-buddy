# frozen_string_literal: true

require 'rails_helper'

describe Rails::Buddy::RequestsController, type: :request do
  describe '#index' do
    before { get '/buddy' }

    it { expect(response).to have_http_status(:ok) }
  end
end
