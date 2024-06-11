# frozen_string_literal: true

require 'test_helper'

module Rails
  class BuddyTest < ActiveSupport::TestCase
    test 'it has a version number' do
      assert Rails::Buddy::VERSION
    end
  end
end
