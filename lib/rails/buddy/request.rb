# frozen_string_literal: true

module Rails
  module Buddy
    class Request
      class << self
        attr_reader :request

        def from_rack_env(rack_env)
          @request = ::Rack::Request.new(rack_env)
          new(path:, method:)
        end

        private

        def path = request.fullpath

        def method
          request_method = request.env['REQUEST_METHOD'].downcase.to_sym
          if request_method == :post && request.params.key?('_method')
            request.params['_method'].to_sym
          else
            request_method
          end
        end
      end

      attr_reader :request_id, :path, :method, :time, :models, :queries
      attr_accessor :request, :response, :meta, :status

      alias id request_id

      def initialize(path:, method:)
        @request_id = SecureRandom.uuid
        @time = Time.current
        @path = path
        @method = method
        @models = Hash.new(0)
        @queries = []
        @view_partials = []
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

      def add_view(type:, view:, parent:, count: 1)
        @view_partials << { type:, view:, count:, parent: }
      end

      def action_definition
        return unless meta[:controller] && meta[:action]

        meta[:controller].constantize.instance_method(meta[:action]).source_location.join(':')
      end

      def views
        @views ||= partials_structured
      end

      private

      def partials_structured # rubocop:disable Metrics/MethodLength
        reconcilate_layout_and_template
        deep = []

        @view_partials.reverse_each do |partial|
          node = create_node_from_partial(partial)
          if deep.present?
            deep.pop while deep.last[:file] != partial[:parent]
            deep.last[:children] << node
          end
          deep << node
        end
        deep.first
      end

      def reconcilate_layout_and_template
        layout = @view_partials.find { |p| p[:type] == :layout }
        template = @view_partials.find { |p| p[:type] == :template }
        template[:parent] = layout[:view] if layout && template
      end

      def create_node_from_partial(partial)
        { file: partial[:view], children: [], type: partial[:type], count: partial[:count] }
      end
    end
  end
end
