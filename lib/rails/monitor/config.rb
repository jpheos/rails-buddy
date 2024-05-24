module Rails
  module Monitor
    class Config
      def ignore_request?(env)
        ["/assets"].any? { |s| env['PATH_INFO'].start_with? s }
      end
    end
  end
end
