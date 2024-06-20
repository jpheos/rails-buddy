# frozen_string_literal: true

require 'rails/buddy/version'
require 'turbo-rails'

module Rails
  module Buddy
    autoload :VERSION, 'rails/buddy/version'
    autoload :Config, 'rails/buddy/config'
    autoload :Current, 'rails/buddy/current'
    autoload :Request, 'rails/buddy/request'
    autoload :RequestsBuffer, 'rails/buddy/requests_buffer'
    autoload :Tracker, 'rails/buddy/tracker'

    class << self
      def config
        @config ||= Config.new
      end

      def configure
        yield config
      end
    end
  end
end

require 'rails/buddy/engine'
