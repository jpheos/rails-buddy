# frozen_string_literal: true

FactoryBot.define do
  factory :rails_buddy_request, class: Rails::Buddy::Request do
    path { '/example' }
    add_attribute(:method) { :get } # method is reserver keyword in FactoryBot

    initialize_with { new(path:, method:) }
  end
end
