# frozen_string_literal: true

module Rails
  module Buddy
    class Current < ActiveSupport::CurrentAttributes
      attribute :request
      attribute :ignore

      alias ignore? ignore

      def new_request!(rack_env)
        self.request = Request.from_rack_env(rack_env)
      end

      def pop_request!
        request.tap { self.request = nil }
      end
    end
  end
end