module Rails
  module Monitor
    class Engine < ::Rails::Engine
      isolate_namespace Rails::Monitor
    end
  end
end
