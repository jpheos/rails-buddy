# frozen_string_literal: true

require 'rails/generators'

module Rails
  module Buddy
    class ConfigGenerator < Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      desc 'This generator creates an initializer file at config/initializers, ' \
           'with the default configuration options for Rails::Buddy.'
      def add_initializer
        path = File.expand_path('templates/initializer.rb', __dir__)
        content = File.binread(path)
                      .gsub!('[PREFIX]', Config::DEFAULT_PATH_PREFIX)
                      .gsub!('[BUFFER_SIZE]', Config::DEFAULT_BUGGER_SIZE.to_s)
        File.binwrite('config/initializers/buddy.rb', content)
        say_status :create, relative_to_original_destination_root('config/initializers/buddy.rb')
      end
    end
  end
end
