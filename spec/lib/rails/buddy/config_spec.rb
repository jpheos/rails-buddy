# frozen_string_literal: true

describe Rails::Buddy::Config do
  let(:config) { described_class.new }

  it 'accessible from Rails::Buddy.config' do
    expect(Rails::Buddy.config).to be_a described_class
  end

  it 'has default values' do # rubocop:disable RSpec/MultipleExpectations
    expect(config.prefix).to eq '/buddy'
    expect(config.buffer_size).to eq 200
  end

  it 'is possible to configure with block' do
    Rails::Buddy.configure do |config|
      expect(config).to be_a described_class
    end
  end

  it 'is possible to change the prefix' do
    config.prefix = '/new_prefix'
    expect(config.prefix).to eq('/new_prefix')
  end

  it 'is possible to change the buffer' do
    config.buffer_size = 400
    expect(config.buffer_size).to eq(400)
  end

  context 'when the environment is ...' do
    subject { described_class.new.enabled? }

    before do
      allow(Rails).to receive(:env) { env.inquiry }
    end

    context 'when production' do
      let(:env) { 'production' }

      it { is_expected.to be false }
    end

    context 'when development' do
      let(:env) { 'development' }

      it { is_expected.to be true }
    end

    context 'when test' do
      let(:env) { 'test' }

      it { is_expected.to be false }
    end
  end

  describe 'ignore_request?' do
    subject { config.ignore_request?(env) }

    let(:env) { { 'PATH_INFO' => path } }

    prefixed_paths = {
      Rails::Buddy::Config::DEFAULT_PATH_PREFIX => {
        '/buddy' => true,
        '/assets' => true,
        '/buddy/example' => true,
        '/assets/example' => true,
        '/monitor' => false,
        '/prefix/buddy' => false,
        '/prefix/assets' => false,
        '/example' => false,
        '/example/with/mutiple/segments' => false
      },
      '/monitor' => {
        '/buddy' => false,
        '/assets' => true,
        '/monitor' => true
      }
    }

    prefixed_paths.each do |prefix, paths|
      context "when prefix is #{prefix}" do
        before { config.prefix = prefix }

        paths.each do |path, expected|
          context "when path is #{path}" do
            let(:path) { path }

            it { is_expected.to be expected }
          end
        end
      end
    end

    context 'when request is a websocket' do
      let(:env) { { 'PATH_INFO' => '/cable_or_other', 'HTTP_UPGRADE' => 'websocket' } }

      it { is_expected.to be true }
    end
  end
end
