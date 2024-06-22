# frozen_string_literal: true

class ExamplesController < ApplicationController
  def index; end

  def get     = render plain: 'ok'
  def post    = render plain: 'ok'
  def put     = render plain: 'ok'
  def patch   = render plain: 'ok'
  def delete  = render plain: 'ok'
end
