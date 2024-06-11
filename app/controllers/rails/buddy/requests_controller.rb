module Rails
  module Buddy
    class RequestsController < ApplicationController
      def index
        @requests = RequestsBuffer.all
      end

      def show
        @request = RequestsBuffer.find(params[:id])
        render :deleted if @request.nil?
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
