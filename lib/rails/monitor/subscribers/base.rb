module Rails
  module Monitor
    module Subscribers
      class Base
        class << self
          def subscribe
            self::EVENTS.each do |name, method|
              ActiveSupport::Notifications.subscribe(name) do |event|
                send(method, event) unless Current.ignore?
              end
            end
          end
        end
      end
    end
  end
end
