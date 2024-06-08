require 'rails/generators'

module Rails
  module Monitor
    class ConfigGenerator < Rails::Generators::Base
      source_root File.expand_path("../templates", __FILE__)

      desc "This generator creates an initializer file at config/initializers, " +
          "with the default configuration options for Rails::Monitor."
      def add_initializer
        path = File.expand_path("../templates/initializer.rb", __FILE__)
        content = File.binread(path).gsub!('[PREFIX]', Config::DEFAULT_PATH_PREFIX).gsub!('[BUFFER_SIZE]', Config::DEFAULT_BUGGER_SIZE.to_s)
        File.open('config/initializers/monitor.rb', "wb") { |file| file.write(content) }
        say_status :create, relative_to_original_destination_root('config/initializers/monitor.rb')
      end
    end
  end
end
