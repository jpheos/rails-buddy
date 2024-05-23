module Rails
  module Monitor
    class RequestsController < ApplicationController
      def index
        @requests = RequestsBuffer.all
      end

      def clear
        RequestsBuffer.clear!
        redirect_to root_path
      end
    end
  end
end
