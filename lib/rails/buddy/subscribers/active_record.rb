# frozen_string_literal: true

require_relative 'base'

module Rails
  module Buddy
    module Subscribers
      class ActiveRecord < Base
        EVENTS = { 'sql.active_record' => :active_record }.freeze

        class << self
          def subscribe
            super
            ActiveSupport.on_load(:active_record) do
              after_initialize do |model|
                Tracker.add_model(model)
              end
            end
          end

          def active_record(event) # rubocop:disable Metrics/MethodLength
            return unless Tracker.track? && event.payload[:name] != 'SCHEMA'

            payload = event.payload

            Tracker.add_query({
                                title: title_from_payload(payload, event.duration),
                                name: payload[:name],
                                sql: sql_from_payload(payload),
                                cached: payload[:cached].present?,
                                async: payload[:async],
                                duration: event.duration.round(1),
                                lock_wait: payload[:lock_wait]&.round(1)
                              })
          end

          private

          def title_from_payload(payload, duration)
            title = if payload[:async]
                      "ASYNC #{payload[:name]} (#{payload[:lock_wait].round(1)}ms) (db time #{duration.round(1)}ms)"
                    else
                      "#{payload[:name] || 'Unnamed'} (#{duration.round(1)}ms)"
                    end
            payload[:cached] ? "CACHE #{title}" : title
          end

          def sql_from_payload(payload)
            sql = payload[:sql]

            payload[:binds].reverse.each_with_index do |bind, i|
              match = "$#{payload[:binds].size - i}"
              sql = sql.gsub(match, bind.value_for_database.to_s)
            end
            sql
          end
        end
      end
    end
  end
end
