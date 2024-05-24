require "rails/monitor/version"

module Rails
  module Monitor
    autoload :VERSION, "rails/monitor/version"
    autoload :Config, "rails/monitor/config"
    autoload :Current, "rails/monitor/current"
    autoload :Request, "rails/monitor/request"
    autoload :RequestsBuffer, "rails/monitor/requests_buffer"

    class << self
      def config
        @config ||= Config.new
      end
    end
  end
end

require "rails/monitor/engine"
