class CommentSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :event
  attributes :id, :body, :user
end
