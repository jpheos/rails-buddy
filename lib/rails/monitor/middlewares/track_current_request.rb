module Rails
  module Monitor
    class TrackCurrentRequest
      def initialize(app)
        @app = app
      end

      def call(env)
        Monitor::Current.ignore = Monitor.config.ignore_request?(env)
        return @app.call(env) if Monitor::Current.ignore?

        Monitor::Current.new_request!(url: env['ORIGINAL_FULLPATH'])
        ret = @app.call(env)

        request = Monitor::Current.pop_request!
        Monitor::RequestsBuffer.push(request)

        Turbo::StreamsChannel.broadcast_prepend_to :requests, target: :requests, partial: 'rails/monitor/requests/request', locals: { request: }

        ret
      end
    end
  end
end
