require_relative 'base'

module Rails
  module Buddy
    module Subscribers
      class ActionController < Base
        EVENTS = {'process_action.action_controller' => :process_action}

        class << self
          def process_action(event)
            return if Buddy::Current.ignore? || Current.request.nil?
            meta = event.payload

            meta.delete :headers
            request = meta.delete :request
            response = meta.delete :response

            meta.merge!({
              duration: event.duration,
              cpu_time: event.cpu_time,
              idle_time: event.idle_time,
              allocations: event.allocations,
            })

            Current.request.request = request
            Current.request.response = response
            Current.request.meta = meta
          end
        end
      end
    end
  end
end
