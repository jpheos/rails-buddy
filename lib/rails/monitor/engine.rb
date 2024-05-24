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

      initializer 'rails_monitor.precompile' do |app|
        app.config.assets.precompile += %w[
          rails/monitor/application.css
        ]
      end

      initializer 'rails_monitor.subscribe' do |app|
        require_relative 'subscribers/action_controller'
        Subscribers::ActionController.subscribe
      end
    end
  end
end
