class User < ApplicationRecord
  has_secure_password
  has_many :events_created, class_name: "Event", foreign_key: "user_id"
  has_and_belongs_to_many :events_attending, class_name: "Event", join_table: "events_users"
  has_many :comments

  validates :username, presence: true
  validates :email, uniqueness: true, presence: true
end
