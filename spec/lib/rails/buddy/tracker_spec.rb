# frozen_string_literal: true

describe Rails::Buddy::Tracker do
  describe '.add_model' do
    before do
      allow(Rails::Buddy::Current).to receive(:request).and_return(request)
    end

    let(:request) { build(:rails_buddy_request) }

    context 'when tracking is enabled' do
      before do
        allow(described_class).to receive(:track?).and_return(true)
      end

      it 'adds a model to the current request' do
        allow(request).to receive(:add_model)
        described_class.add_model('UserModel')
        expect(request).to have_received(:add_model).with('UserModel')
      end
    end

    context 'when tracking is disabled' do
      before do
        allow(described_class).to receive(:track?).and_return(false)
      end

      it 'adds a model to the current request' do
        allow(request).to receive(:add_model)
        described_class.add_model('UserModel')
        expect(request).not_to have_received(:add_model).with('UserModel')
      end
    end
  end

  describe '.add_query' do
    before do
      allow(Rails::Buddy::Current).to receive(:request).and_return(request)
    end

    let(:request) { build(:rails_buddy_request) }

    context 'when tracking is enabled' do
      before do
        allow(described_class).to receive(:track?).and_return(true)
      end

      it 'adds a model to the current request' do
        allow(request).to receive(:add_query)
        described_class.add_query('SELECT * FROM users;')
        expect(request).to have_received(:add_query).with('SELECT * FROM users;')
      end
    end

    context 'when tracking is disabled' do
      before do
        allow(described_class).to receive(:track?).and_return(false)
      end

      it 'adds a model to the current request' do
        allow(request).to receive(:add_query)
        described_class.add_query('SELECT * FROM users;')
        expect(request).not_to have_received(:add_query).with('SELECT * FROM users;')
      end
    end
  end

  describe '.track?' do
    subject { described_class.track? }

    before do
      allow(Rails::Buddy::Current).to receive_messages(ignore?: current_ignored, request:)
    end

    context 'when the current is ignored' do
      let(:current_ignored) { true }

      context 'when there is a current request' do
        let(:request) { build(:rails_buddy_request) }

        it { is_expected.to be_falsey }
      end

      context 'when there is no current request' do
        let(:request) { nil }

        it { is_expected.to be_falsey }
      end
    end

    context 'when the current is not ignored' do
      let(:current_ignored) { false }

      context 'when there is a current request' do
        let(:request) { build(:rails_buddy_request) }

        it { is_expected.to be_truthy }
      end

      context 'when there is no current request' do
        let(:request) { nil }

        it { is_expected.to be_falsey }
      end
    end
  end
end
