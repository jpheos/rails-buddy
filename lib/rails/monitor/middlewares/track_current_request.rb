module Rails
  module Monitor
    class TrackCurrentRequest
      def initialize(app)
        @app = app
      end

      def call(env)
        Monitor::Current.new_request!(url: env['ORIGINAL_FULLPATH'])
        ret = @app.call(env)
        Monitor::RequestsBuffer.push(Monitor::Current.pop_request!)
        ret
      end
    end
  end
end
