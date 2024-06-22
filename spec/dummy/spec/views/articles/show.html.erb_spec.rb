# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articles/show' do
  before do
    assign(:article, Article.create!(
                       title: 'Title',
                       content: 'Content'
                     ))
  end

  it 'renders attributes in <p>' do
    render
    expect(rendered).to match(/Title/)
    expect(rendered).to match(/Content/)
  end
end
