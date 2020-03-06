class EventSerializer < ActiveModel::Serializer
  has_many :attendees
  has_many :comments
  belongs_to :user
  attributes :id, :name, :location, :date
end
