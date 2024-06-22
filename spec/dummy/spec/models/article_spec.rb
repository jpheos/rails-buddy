# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Article do
  it 'is valid with valid attributes' do
    expect(described_class.new(title: 'Title', content: 'Content')).to be_valid
  end

  it 'is not valid without a title' do
    expect(described_class.new(title: nil, content: 'Content')).not_to be_valid
  end

  it 'is not valid with too short title' do
    expect(described_class.new(title: 'XXXX', content: 'Content')).not_to be_valid
  end

  it 'is not valid without content' do
    expect(described_class.new(title: 'Title', content: nil)).not_to be_valid
  end
end
