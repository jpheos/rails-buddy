module Rails
  module Monitor
    class RequestsController < ApplicationController
      def index
        @requests = RequestsBuffer.all
      end

      def show
        @request = RequestsBuffer.find(params[:id])
      end

      def clear
        RequestsBuffer.clear!
        redirect_to root_path
      end

      def close

      end
    end
  end
end
