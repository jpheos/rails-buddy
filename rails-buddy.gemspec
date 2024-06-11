require_relative "lib/rails/buddy/version"

Gem::Specification.new do |spec|
  spec.name        = "rails-buddy"
  spec.version     = Rails::Buddy::VERSION
  spec.author      = "Joseph BLANCHARD"
  spec.email       = ["jooo.blanchard@gmail.com"]
  spec.homepage    = "https://github.com/jpheos/rails-buddy"
  spec.summary     = "Your buddy to monitor your app."
  spec.description = "A development gem to monitor your rails application."
  spec.license     = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"].reject do |file|
      file.start_with?(*%w[app/javascript app/assets/stylesheets app/assets/builds/rails/buddy/application.js.map])
    end
  end

  spec.add_runtime_dependency "rails", "~> 7"
  spec.required_ruby_version = '>= 3.0.0'

  spec.post_install_message = %q{
    Thanks for installing rails-buddy! 🎉
    Just go to http://localhost:3000/buddy
  }
end
