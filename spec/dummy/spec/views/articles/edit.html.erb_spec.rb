# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articles/edit' do
  let(:article) do
    Article.create!(
      title: 'MyString',
      content: 'MyString'
    )
  end

  before do
    assign(:article, article)
  end

  it 'renders the edit article form' do
    render

    assert_select 'form[action=?][method=?]', article_path(article), 'post' do
      assert_select 'input[name=?]', 'article[title]'

      assert_select 'input[name=?]', 'article[content]'
    end
  end
end
