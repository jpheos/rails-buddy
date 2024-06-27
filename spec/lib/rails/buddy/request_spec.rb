# frozen_string_literal: true

# this fake controller is use for test action_definition method
class DummyController
  def test_action; end
end

describe Rails::Buddy::Request do
  let(:request) { build(:rails_buddy_request) }

  describe '.from_rack_env' do
    subject { described_class.from_rack_env(rack_env) }

    let(:rack_env) { Rack::MockRequest.env_for('http://example.com/path_example?john=doe', method:, params:) }
    let(:method) { nil }
    let(:params) { nil }

    it 'returns a new instance of Request' do
      expect(subject).to be_a(described_class)
    end

    it do
      expect(subject.path).to eq('/path_example?john=doe')
    end

    it { expect(subject.method).to eq(:get) }

    context 'when method is DELETE' do
      let(:method) { 'DELETE' }

      it { expect(subject.method).to eq(:delete) }
    end

    context 'when method is PUT' do
      let(:method) { 'PUT' }

      it { expect(subject.method).to eq(:put) }
    end

    context 'when method is PATCH' do
      let(:method) { 'PATCH' }

      it { expect(subject.method).to eq(:patch) }
    end

    context 'when method is SOMETHING_ELSE' do
      let(:method) { 'SOMETHING_ELSE' }

      it { expect(subject.method).to eq(:something_else) }
    end

    context 'when method is POST' do
      let(:method) { 'POST' }

      it { expect(subject.method).to eq(:post) }

      context 'when the _method param is present' do
        let(:params) { { '_method' => 'delete' } }

        it 'returns the method from the _method param' do
          expect(subject.method).to eq(:delete)
        end
      end
    end
  end

  describe '.new' do
    subject { described_class.new(path: '/path_example', method: :get) }

    it 'returns a new instance of Request' do
      expect(subject).to be_a(described_class)
    end

    it { expect(subject.request_id).to be_a(String) }
    it { expect(subject.time).to be_a(Time) }
    it { expect(subject.path).to eq('/path_example') }
    it { expect(subject.method).to eq(:get) }
    it { expect(subject.models).to eq({}) }
    it { expect(subject.queries).to eq([]) }

    it { expect(subject.request).to be_nil }
    it { expect(subject.status).to be_nil }
    it { expect(subject.response).to be_nil }
    it { expect(subject.meta).to be_nil }
  end

  describe '#familly_status' do
    subject { request.familly_status }

    it { is_expected.to eq('UNKNOWN') }

    {
      'success' => (200..210),
      'redirect' => (300..310),
      'error' => (400..410),
      'fatal_error' => (500..510)
    }.each do |status, range|
      range.each do |code|
        it "returns '#{status}' when status is #{code}" do
          request.status = code
          expect(subject).to eq(status)
        end
      end
    end
  end

  describe '#add_model' do
    subject { request.models }

    before do
      stub_const('A', Class.new)
      stub_const('B', Class.new)
    end

    it 'adds the model to the models hash' do
      request.add_model(A.new)
      request.add_model(B.new)
      request.add_model(A.new)

      expect(subject).to eq('A' => 2, 'B' => 1)
    end
  end

  describe '#add_query' do
    subject { request.queries }

    it 'adds the query to the queries array' do
      request.add_query('SELECT * FROM users')
      request.add_query('SELECT * FROM posts')

      expect(subject).to eq(['SELECT * FROM users', 'SELECT * FROM posts'])
    end
  end

  describe '#action_definition' do
    subject { request.action_definition }

    let(:meta) { { controller:, action: } }
    let(:controller) { nil }
    let(:action) { nil }

    before do
      request.meta = meta
    end

    context 'when only controller meta is present' do
      let(:controller) { 'DummyController' }

      it { is_expected.to be_nil }
    end

    context 'when only action meta is present' do
      let(:action) { 'test_action' }

      it { is_expected.to be_nil }
    end

    context 'when both controller and meta are present' do
      let(:controller) { 'DummyController' }
      let(:action) { 'test_action' }

      it { is_expected.to eq("#{__FILE__}:5") }
    end
  end
end
