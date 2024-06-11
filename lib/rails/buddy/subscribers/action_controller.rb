# frozen_string_literal: true

require_relative 'base'

module Rails
  module Buddy
    module Subscribers
      class ActionController < Base
        EVENTS = { 'process_action.action_controller' => :process_action }.freeze

        class << self
          def process_action(event)
            return if prevent_processing?

            meta = event.payload
            meta.delete :headers
            meta.merge!({
                          duration: event.duration,
                          cpu_time: event.cpu_time,
                          idle_time: event.idle_time,
                          allocations: event.allocations
                        })

            save_meta_in_current_request(meta)
          end

          private

          def prevent_processing? = Current.ignore? || Current.request.nil?

          def save_meta_in_current_request(meta)
            Current.request.request = meta.delete(:request)
            Current.request.response = meta.delete(:response)
            Current.request.meta = meta
          end
        end
      end
    end
  end
end
