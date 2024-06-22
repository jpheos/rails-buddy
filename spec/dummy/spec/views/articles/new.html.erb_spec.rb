# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'articles/new' do
  before do
    assign(:article, Article.new(
                       title: 'MyString',
                       content: 'MyString'
                     ))
  end

  it 'renders new article form' do
    render

    assert_select 'form[action=?][method=?]', articles_path, 'post' do
      assert_select 'input[name=?]', 'article[title]'

      assert_select 'input[name=?]', 'article[content]'
    end
  end
end
