# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby File.read(File.join(File.dirname(__FILE__), '.ruby-version')).strip

# Specify your gem's dependencies in rails-buddy.gemspec.
gemspec

group :development, :test do
  gem 'awesome_print'
  gem 'puma'
  gem 'rspec-rails'
  gem 'rubocop'
  gem 'rubocop-performance'
  gem 'rubocop-rails'
  gem 'rubocop-rspec'
  gem 'rubocop-rspec_rails'
  gem 'sprockets-rails'
  gem 'sqlite3', '~> 1.7'
end
