require_relative 'base'

module Rails
  module Monitor
    module Subscribers
      class ActiveRecord < Base
        EVENTS = {'sql.active_record' => :active_record}

        class << self
          def subscribe
            super
            ActiveSupport.on_load(:active_record) do
              after_initialize do |model|
                Tracker::add_model(model)
              end
            end
          end

          def active_record(event)
            return unless Tracker.track?

            payload = event.payload

            return if payload[:name] == 'SCHEMA'

            title = if payload[:async]
              "ASYNC #{payload[:name]} (#{payload[:lock_wait].round(1)}ms) (db time #{event.duration.round(1)}ms)"
            else
              "#{payload[:name] || "Unnamed"} (#{event.duration.round(1)}ms)"
            end
            title = "CACHE #{title}" if payload[:cached]

            sql = payload[:sql]

            payload[:binds].reverse.each_with_index do |bind, i|
              match = "$#{payload[:binds].size - i}"
              sql = sql.gsub(match, bind.value_for_database.to_s)
            end

            Tracker.add_query({
              title: title,
              name: payload[:name],
              sql: sql,
              cached: payload[:cached].present?,
              async: payload[:async],
              duration: event.duration.round(1),
              lock_wait: payload[:lock_wait]&.round(1)
            })
          end
        end
      end
    end
  end
end
