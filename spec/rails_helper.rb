# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'

require 'spec_helper'
require_relative 'dummy/config/environment'
require 'rspec/rails'
require 'support/factory_bot'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
