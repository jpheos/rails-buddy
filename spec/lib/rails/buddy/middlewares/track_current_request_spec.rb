# frozen_string_literal: true

describe Rails::Buddy::Middlewares::TrackCurrentRequest, type: :request do
  subject(:do_request) { get path }

  let(:path) { '/get' }

  it 'check if the request is ignored' do
    allow(Rails::Buddy.config).to receive(:ignore_request?).and_call_original
    do_request
    expect(Rails::Buddy.config).to have_received(:ignore_request?)
  end

  it 'create a new request' do
    allow(Rails::Buddy::Current).to receive(:new_request!).and_call_original
    do_request
    expect(Rails::Buddy::Current).to have_received(:new_request!)
  end

  it 'push request in buffer' do
    allow(Rails::Buddy::RequestsBuffer).to receive(:push).and_call_original.with(an_instance_of(Rails::Buddy::Request))
    do_request
    expect(Rails::Buddy::RequestsBuffer).to have_received(:push)
  end

  it 'broadcast the request' do
    allow(Turbo::StreamsChannel).to receive(:broadcast_append_to).and_call_original
    do_request
    expect(Turbo::StreamsChannel).to have_received(:broadcast_append_to)
  end

  context 'when the request is ignored' do
    let(:path) { '/buddy' }

    it 'does not create a new request' do
      allow(Rails::Buddy::Current).to receive(:new_request!)
      do_request
      expect(Rails::Buddy::Current).not_to have_received(:new_request!)
    end

    it 'does not push request in buffer' do
      allow(Rails::Buddy::RequestsBuffer).to receive(:push)
      do_request
      expect(Rails::Buddy::RequestsBuffer).not_to have_received(:push)
    end

    it 'does not broadcast anything' do
      allow(Turbo::StreamsChannel).to receive(:broadcast_append_to)
      do_request
      expect(Turbo::StreamsChannel).not_to have_received(:broadcast_append_to)
    end
  end
end
