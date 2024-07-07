# frozen_string_literal: true

class RenderController < ApplicationController
  def plain
    render plain: 'ok'
  end

  def json
    render json: { status: 'ok' }
  end

  def with_partial; end

  def with_collection; end

  def without_layout
    render layout: false
  end

  def partial_from_controller
    render partial: 'partial_first_level'
  end
end
