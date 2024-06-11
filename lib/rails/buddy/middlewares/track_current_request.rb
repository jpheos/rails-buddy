# frozen_string_literal: true

module Rails
  module Buddy
    class TrackCurrentRequest
      def initialize(app)
        @app = app
      end

      def call(env)
        Buddy::Current.ignore = Buddy.config.ignore_request?(env)
        return @app.call(env) if Buddy::Current.ignore?

        Buddy::Current.new_request!(env)

        @app.call(env).tap do |response|
          save_request(response)
        end
      end

      private

      def save_request(response)
        request = Buddy::Current.pop_request!
        return unless request

        request.status = response[0]
        Buddy::RequestsBuffer.push(request)

        Turbo::StreamsChannel.broadcast_append_to :requests,
                                                  target: :requests,
                                                  partial: 'rails/buddy/requests/request',
                                                  locals: { request: }
      end
    end
  end
end
