module Rails
  module Buddy
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

      attr_reader :request_id, :path, :method, :time, :models, :queries
      attr_accessor :request, :response, :meta, :status

      alias_method :id, :request_id

      def initialize(path:, method:)
        @request_id = SecureRandom.uuid
        @time = Time.current
        @path = path
        @method = method
        @models = Hash.new(0)
        @queries = []
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

      def add_model(model)
        @models[model.class.to_s] += 1
      end

      def add_query(query)
        @queries << query
      end

      def action_definition
        return unless meta[:controller] && meta[:action]

        meta[:controller].constantize.instance_method(meta[:action]).source_location.join(':')
      end
    end
  end
end
