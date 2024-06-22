# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ExamplesController do
  describe 'GET /' do
    it 'returns http success' do
      get '/'
      expect(response).to have_http_status(:success)
    end
  end

  %i[get post put patch delete].each do |method|
    describe "simple #{method.to_s.upcase} request" do
      before do
        send(method, "/#{method}")
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns ok' do
        expect(response.body).to eq('ok')
      end
    end
  end
end
