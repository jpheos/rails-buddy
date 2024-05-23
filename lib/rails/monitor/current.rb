# frozen_string_literal: true
module Rails
  module Monitor
    class Current < ActiveSupport::CurrentAttributes
      attribute :request
      attribute :ignore

      alias_method :ignore?, :ignore

      def new_request!(url:)
        self.request = Request.new(url: )
      end

      def pop_request!
        request.tap { self.request = nil }
      end
    end
  end
end
