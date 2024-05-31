module Rails
  module Monitor
    class TrackCurrentRequest
      def initialize(app)
        @app = app
      end

      def call(env)
        Monitor::Current.ignore = Monitor.config.ignore_request?(env)
        return @app.call(env) if Monitor::Current.ignore?


        request = ::Rack::Request.new(env)

        Monitor::Current.new_request!(env)
        ret = @app.call(env)


        request = Monitor::Current.pop_request!
        if request
          request.status = ret[0]
          Monitor::RequestsBuffer.push(request)

          Turbo::StreamsChannel.broadcast_append_to :requests, target: :requests, partial: 'rails/monitor/requests/request', locals: { request: }
        end

        ret
      end
    end
  end
end
