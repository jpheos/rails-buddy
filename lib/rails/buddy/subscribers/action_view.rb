# frozen_string_literal: true

require_relative 'base'

module Rails
  module Buddy
    module Subscribers
      class ActionView < Base
        EVENTS = {
          'render_template.action_view' => :render_template,
          'render_partial.action_view' => :render_partial,
          'render_collection.action_view' => :render_collection,
          'render_layout.action_view' => :render_layout
        }.freeze

        class << self
          def render_template(event)
            view = event.payload[:identifier]

            Current.request.add_view(type: :template, view:, parent:) if File.exist?(view)
          end

          def render_partial(event)
            Current.request.add_view(type: :partial, view: event.payload[:identifier], parent:)
          end

          def render_collection(event)
            count = event.payload[:count]
            Current.request.add_view(type: :collection, view: event.payload[:identifier], parent:, count:)
          end

          def render_layout(event)
            Current.request.add_view(type: :layout, view: event.payload[:identifier], parent:)
          end

          private

          def parent
            caller.each do |file|
              match = file.match(/\A(.+\.erb):\d+:in/)
              return match[1] if match
            end
            nil
          end
        end
      end
    end
  end
end
