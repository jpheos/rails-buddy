module Rails
  module Monitor
    class Tracker
      class << self
        def add_model(model)
          return unless track?

          Current.request.add_model(model)
        end

        def add_query(query)
          return unless track?

          Current.request.add_query(query)
        end

        def track?
          !Monitor::Current.ignore? && Current.request
        end
      end
    end
  end
end
