# frozen_string_literal: true

require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe '/articles' do
  # This should return the minimal set of attributes required to create a valid
  # Article. As you add validations to Article, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) do
    { title: 'Title', content: 'Content' }
  end

  let(:invalid_attributes) do
    { title: '', content: '' }
  end

  describe 'GET /index' do
    it 'renders a successful response' do
      Article.create! valid_attributes
      get articles_url
      expect(response).to be_successful
    end
  end

  describe 'GET /show' do
    it 'renders a successful response' do
      article = Article.create! valid_attributes
      get article_url(article)
      expect(response).to be_successful
    end
  end

  describe 'GET /new' do
    it 'renders a successful response' do
      get new_article_url
      expect(response).to be_successful
    end
  end

  describe 'GET /edit' do
    it 'renders a successful response' do
      article = Article.create! valid_attributes
      get edit_article_url(article)
      expect(response).to be_successful
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new Article' do
        expect do
          post articles_url, params: { article: valid_attributes }
        end.to change(Article, :count).by(1)
      end

      it 'redirects to the created article' do
        post articles_url, params: { article: valid_attributes }
        expect(response).to redirect_to(article_url(Article.last))
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Article' do
        expect do
          post articles_url, params: { article: invalid_attributes }
        end.not_to change(Article, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post articles_url, params: { article: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) do
        { title: 'New Title', content: 'New Content' }
      end

      it 'updates the requested article' do
        article = Article.create! valid_attributes
        patch article_url(article), params: { article: new_attributes }
        article.reload
        expect(article.attributes.slice('title', 'content').values).to eq(['New Title', 'New Content'])
      end

      it 'redirects to the article' do
        article = Article.create! valid_attributes
        patch article_url(article), params: { article: new_attributes }
        article.reload
        expect(response).to redirect_to(article_url(article))
      end
    end

    context 'with invalid parameters' do
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        article = Article.create! valid_attributes
        patch article_url(article), params: { article: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'destroys the requested article' do
      article = Article.create! valid_attributes
      expect do
        delete article_url(article)
      end.to change(Article, :count).by(-1)
    end

    it 'redirects to the articles list' do
      article = Article.create! valid_attributes
      delete article_url(article)
      expect(response).to redirect_to(articles_url)
    end
  end
end
