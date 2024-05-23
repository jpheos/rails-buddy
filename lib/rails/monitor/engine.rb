require_relative 'middlewares/track_current_request'

module Rails
  module Monitor
    class Engine < ::Rails::Engine
      isolate_namespace Rails::Monitor

      initializer 'rails_monitor.init' do |app|
        RequestsBuffer.init
      end

      initializer 'rails_monitor.middlewares' do |app|
        app.middleware.insert_after ActionDispatch::Executor, TrackCurrentRequest
      end

      initializer 'rails_monitor.precompile', group: :all do |app|
        app.config.assets.precompile += %w[
          rails/monitor/application.css
        ]
      end
    end
  end
end
