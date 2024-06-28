# frozen_string_literal: true

describe Rails::Buddy::RequestsBuffer do
  subject do
    described_class.init
    described_class.push(request1)
    described_class.push(request2)
    described_class.push(request3)
  end

  let(:request1) { build(:rails_buddy_request) }
  let(:request2) { build(:rails_buddy_request) }
  let(:request3) { build(:rails_buddy_request) }

  describe '.init' do
    it 'initializes the collection' do
      described_class.init
      expect(described_class.instance_variable_get(:@collection)).to eq([])
    end
  end

  describe '.find' do
    it 'finds a request by id' do
      subject
      expect(described_class.find(request2.id)).to eq(request2)
    end
  end

  describe '.push' do
    it 'adds a request to the collection' do
      subject
      expect(described_class.instance_variable_get(:@collection)).to eq([request1, request2, request3])
    end

    context 'when the buffer is full' do
      before { allow(Rails::Buddy.config).to receive(:buffer_size).and_return(2) }

      it 'removes the oldest request' do
        subject
        expect(described_class.instance_variable_get(:@collection)).to eq([request2, request3])
      end
    end
  end

  describe '.all' do
    it 'returns all requests' do
      subject
      expect(described_class.all).to eq([request1, request2, request3])
    end
  end

  describe '.clear!' do
    it 'clears the collection' do
      subject
      described_class.clear!
      expect(described_class.instance_variable_get(:@collection)).to eq([])
    end
  end
end
