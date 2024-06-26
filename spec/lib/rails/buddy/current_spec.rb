# frozen_string_literal: true

describe Rails::Buddy::Current do
  before do
    described_class.reset_all
  end

  describe 'new_request!' do
    let(:rack_env) { { 'REQUEST_METHOD' => 'GET', 'PATH_INFO' => '/example' } }

    it 'create a Rails::Buddy::Request' do
      expect { described_class.new_request!(rack_env) }.to(
        change { described_class.request.class }
          .from(NilClass)
          .to(Rails::Buddy::Request)
      )
    end
  end

  describe 'pop_request!' do
    context 'when request is nil' do
      it 'return nil' do
        expect(described_class.pop_request!).to be_nil
      end
    end

    context 'when request is present' do
      let(:request) { 'data' }

      before do
        described_class.request = request
      end

      it 'return request' do
        expect(described_class.pop_request!).to eq(request)
      end

      it 'reset request' do
        expect { described_class.pop_request! }.to(
          change(described_class, :request)
            .from(request)
            .to(nil)
        )
      end
    end
  end

  describe 'ignore' do
    it 'default value is true' do
      expect(described_class.ignore).to be(true)
    end

    it 'alias ignore?' do
      expect(described_class.ignore?).to be(true)
    end

    it 'can be set to false' do
      described_class.ignore = false
      expect(described_class.ignore?).to be(false)
    end
  end
end
