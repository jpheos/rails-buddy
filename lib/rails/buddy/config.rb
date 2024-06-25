# frozen_string_literal: true

module Rails
  module Buddy
    class Config
      DEFAULT_BUGGER_SIZE = 200
      DEFAULT_PATH_PREFIX = '/buddy'

      attr_accessor :prefix, :buffer_size
      attr_reader :enabled

      alias enabled? enabled

      def initialize(options = {})
        opt = defaults.merge options

        @prefix       = opt[:prefix]
        @buffer_size  = opt[:buffer_size]
        @enabled = opt[:enabled]
      end

      def ignore_request?(env)
        [prefix, '/assets'].any? { |s| env['PATH_INFO'].start_with? s } || env['HTTP_UPGRADE'] == 'websocket'
      end

      private

      def defaults
        {
          enabled: Rails.env.development?,
          prefix: DEFAULT_PATH_PREFIX,
          buffer_size: DEFAULT_BUGGER_SIZE
        }
      end
    end
  end
end
