class User < ApplicationRecord
  has_many :events_created, class_name: "Event", foreign_key: "user_id"
  has_many :comments

  has_and_belongs_to_many :events_attending, class_name: "Event", join_table: "events_users"
end
