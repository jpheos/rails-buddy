module Rails
  module Monitor
    class Request
      attr_reader :request_id, :url, :time

      def initialize(url:)
        @request_id = SecureRandom.uuid
        @time = Time.current
        @url = url
      end

      def to_h
        {
          request_id: request_id,
          url: @url
        }
      end

      alias_method :id, :request_id
    end
  end
end
