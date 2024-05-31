module Rails
  module Monitor
    class Request
      class << self
        attr_reader :request

        def from_rack_env(rack_env)
          @request = ::Rack::Request.new(rack_env)
          new(path: path, method:)
        end

        def path = request.fullpath

        def method
          request_method = request.env['REQUEST_METHOD'].downcase.to_sym
          if request_method == :post
            request.params['_method'].presence&.to_sym || request_method
          else
            request_method
          end
        end
      end

      attr_reader :request_id, :path, :method, :time
      attr_accessor :request, :response, :meta, :status

      alias_method :id, :request_id

      def initialize(path:, method:)
        @request_id = SecureRandom.uuid
        @time = Time.current
        @path = path
        @method = method
      end

      def familly_status
        case status.to_s[0]
        when '2' then 'success'
        when '3' then 'redirect'
        when '4' then 'error'
        when '5' then 'fatal_error'
        else
          'UNKNOWN'
        end
      end
    end
  end
end
