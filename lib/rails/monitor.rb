require "rails/monitor/version"

module Rails
  module Monitor
    autoload :VERSION, "rails/monitor/version"
    autoload :Current, "rails/monitor/current"
    autoload :Request, "rails/monitor/request"
    autoload :RequestsBuffer, "rails/monitor/requests_buffer"
  end
end

require "rails/monitor/engine"
