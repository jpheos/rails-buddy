require_relative "lib/rails/buddy/version"

Gem::Specification.new do |spec|
  spec.name        = "rails-buddy"
  spec.version     = Rails::Buddy::VERSION
  spec.authors     = ["Joseph BLANCHARD"]
  spec.email       = ["jooo.blanchard@gmail.com"]
  spec.homepage    = "https://github.com/jpheos/rails-buddy"
  spec.summary     = "Gem to monitor your rails app."
  spec.description = "Gem to monitor your rails app."
  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://github.com/jpheos/rails-buddy'"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = spec.homepage

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "rails", ">= 7.1.1"
end
