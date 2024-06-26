# frozen_string_literal: true

module Rails
  module Buddy
    class Current < ActiveSupport::CurrentAttributes
      attribute :request
      attribute :ignore

      alias ignore? ignore

      resets do
        self.request = nil
        self.ignore = true
      end

      def new_request!(rack_env)
        self.request = Request.from_rack_env(rack_env)
      end

      def pop_request!
        request.tap { self.request = nil }
      end
    end
  end
end
