# frozen_string_literal: true

require_relative 'middlewares/track_current_request'

module Rails
  module Buddy
    class Engine < ::Rails::Engine
      isolate_namespace Rails::Buddy

      config.generators do |generator|
        generator.helper false
        generator.skip_routes true
        generator.system_tests nil
        generator.test_framework :rspec
      end

      initializer 'rails_buddy.init' do |_app|
        RequestsBuffer.init
      end

      initializer 'rails_buddy.middlewares' do |app|
        app.middleware.insert_after ActionDispatch::Executor, TrackCurrentRequest
      end

      initializer 'rails_buddy.routing' do |app|
        app.routes.append do
          mount Engine => Buddy.config.prefix
        end
      end

      initializer 'rails_buddy.precompile' do |app|
        app.config.assets.precompile += %w[
          rails/buddy/application.css
          rails/buddy/application.js
        ]
      end

      initializer 'rails_buddy.subscribe' do |_app|
        require_relative 'subscribers/action_controller'
        Subscribers::ActionController.subscribe
        require_relative 'subscribers/active_record'
        Subscribers::ActiveRecord.subscribe
      end
    end
  end
end
