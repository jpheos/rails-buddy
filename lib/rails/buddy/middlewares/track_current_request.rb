module Rails
  module Buddy
    class TrackCurrentRequest
      def initialize(app)
        @app = app
      end

      def call(env)
        Buddy::Current.ignore = Buddy.config.ignore_request?(env)
        return @app.call(env) if Buddy::Current.ignore?


        request = ::Rack::Request.new(env)

        Buddy::Current.new_request!(env)
        ret = @app.call(env)


        request = Buddy::Current.pop_request!
        if request
          request.status = ret[0]
          Buddy::RequestsBuffer.push(request)

          Turbo::StreamsChannel.broadcast_append_to :requests, target: :requests, partial: 'rails/buddy/requests/request', locals: { request: }
        end

        ret
      end
    end
  end
end
