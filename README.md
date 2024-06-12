[![Ci Status](https://github.com/jpheos/rails-buddy/actions/workflows/ci.yml/badge.svg)](https://github.com/jpheos/rails-buddy/actions)

# Rails::Buddy

Buddy is a gem designed to assist you in the development of your Rails application. Currently, it provides monitoring capabilities, but the goal is to evolve it to include additional metrics and features over time.


## Usage

- Install the gem
- Restart your server
- Go to http://localhost:3000/buddy
- Begin to navigate in your application
- Enjoy requests logs in the page http://localhost:3000/buddy 🎉

## Installation
Add this line to your application's Gemfile in **development** group:

```ruby
gem 'rails-buddy'
```

And then execute:
```bash
$ bundle
```

If you want configure option, just run:

```bash
$ rails g rails:buddy:config
```

You have to actually only two options:

- `prefix` default `/buddy`. This is the setting to mount the application
- `buffer_size` default `200`. This is the number maximum of last requests store in the buffer.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgments

This project was **deeply** inspired by [Julien Bourdeau's debugbar](https://github.com/julienbourdeau/debugbar). Special thanks to Julien Bourdeau for his work, which served as a valuable reference in the creation of this gem.
