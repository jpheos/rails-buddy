module Rails
  module Monitor
    class Config
      attr_accessor :prefix

      def initialize(options = {})
        opt = defaults.merge options

        @prefix = opt[:prefix]
      end

      def ignore_request?(env)
        [prefix, "/assets"].any? { |s| env['PATH_INFO'].start_with? s }
      end

      private

      def defaults
        {
          enabled: Rails.env.development?,
          prefix: "/monitoring"
        }
      end
    end
  end
end
