module Rails
  module Monitor
    class ApplicationRecord < ActiveRecord::Base
      self.abstract_class = true
    end
  end
end
