# frozen_string_literal: true

module Rails
  module Buddy
    module Subscribers
      class Base
        class << self
          def subscribe
            self::EVENTS.each do |name, method|
              ActiveSupport::Notifications.subscribe(name) do |event|
                send(method, event) unless prevent_processing?
              end

              private

              def prevent_processing? = Current.ignore? || Current.request.nil?
            end
          end
        end
      end
    end
  end
end
