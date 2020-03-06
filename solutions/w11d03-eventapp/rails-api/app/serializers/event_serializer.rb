class EventSerializer < ActiveModel::Serializer
  has_many :attendees
  belongs_to :user
  has_many :comments
  attributes :id, :name, :location, :date, :attendee_ids
end
