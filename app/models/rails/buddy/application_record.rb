# frozen_string_literal: true

module Rails
  module Buddy
    class ApplicationRecord < ActiveRecord::Base
      self.abstract_class = true
    end
  end
end
