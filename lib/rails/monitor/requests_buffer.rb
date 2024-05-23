module Rails
  module Monitor
    class RequestsBuffer
      class << self
        def init
          @collection = []
        end

        def push(request)
          @collection << request
        end

        def all
          @collection
        end

        def clear!
          @collection = []
        end
      end
    end
  end
end
