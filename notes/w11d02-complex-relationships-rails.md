# Complex Relationships with Rails API

## Introduction (5 mins)

We've had a look at `belongs_to`, `has_many` and `has_and_belongs_to_many` already with Rails. Before you start your projects, let's have a look at some more complex relationships, where two models can have two different types of relationships with each other.

We will be using the following three models:

1. User
	* A user can create an event
	* A user can attend an event
	* A user can create a comment
2. Event
	* An event belongs to a user
	* An event has many attendees
3. Comment
	* A comment belongs to a user
	* A comment belongs to an event

## Scaffolding the Rails API (5 mins)

Run the following commands in the terminal to create the three resources.

```sh
rails new eventapp -d postgresql --api
cd eventapp
rails g scaffold User username email
rails g scaffold Event name date:date location user:references
rails g scaffold Comment body:text user:references event:references
rails db:create
rails db:migrate
```

> **Note:** You will need to drop your database if you already have one with the same name using `rails db:drop`.

## Setting up basic relationships (5 mins)

Let's set up the basic relationships between each model.

In the `Event` model:

```ruby
class Event < ApplicationRecord
  belongs_to :user
  has_many :comments
end
```

In the `User` model:

```ruby
class User < ApplicationRecord
  has_many :events
  has_many :comments
end
```

In the `Comment` model:

```ruby
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :event
end
```

We can add some seeds to our `db/seeds.rb` file.

```ruby
user = User.create!(username: "emilyi", email: "emily.isacke@ga.co")

Event.create!(name: "WDI25 Grad Ball", date: Date.new(2017, 4, 28), location: "Black Horse, Leman Street, London", user: user)
```

Seed your database, and then enter the Rails console:

```sh
rails db:seed
rails c
```

In order to find all users in the database, run:

```sh
User.all
```

You should get one user returned:

```sh
=> #<ActiveRecord::Relation [#<User id: 1, username: "emilyi", email: "emily.isacke@ga.co", created_at: "2017-04-11 13:13:39", updated_at: "2017-04-11 13:13:39">]>
```

In order to find all events in the database, run:

```sh
Event.all
```

You should get one event returned:

```sh
=> #<ActiveRecord::Relation [#<Event id: 1, name: "WDI25 Grad Ball", date: "2017-04-28", location: "Black Horse, Leman Street, London", user_id: 1, created_at: "2017-04-11 13:13:39", updated_at: "2017-04-11 13:13:39">]>
irb(main):003:0> 
```

Notice here that the event has a `user_id` of `1`, which is the ID of the user that we seeded earlier.

Inside the Rails console, run:

```sh
u = User.find 1
u.events
```

You should get back the event that the user has created:

```sh
=> #<ActiveRecord::Associations::CollectionProxy [#<Event id: 1, name: "WDI25 Grad Ball", date: "2017-04-28", location: "Black Horse, Leman Street, London", user_id: 1, created_at: "2017-04-11 13:13:39", updated_at: "2017-04-11 13:13:39">]>
```

## Updating the user/event relationship (10 mins)

We want to be able to create two different types of relationship between the user and the event model. Users can both "create" and "attend" an event.

Update the user model to be:

```ruby
class User < ApplicationRecord
  has_many :events_created, class_name: "Event", foreign_key: "user_id"
  has_many :comments
end
```

Here we are saying that we want to be able to say `.events_created` and see the events that have the user's ID stored inside the `user_id` field.

If you exit the Rails console, and enter it again, and you try:

```sh
u = User.find 1
u.events
```

You will get:

```sh
NoMethodError: undefined method `events' for #<User:0x007fcbf4530210>
```

We don't have a method `.events` anymore, as we have changed it to `.events_created`. Now try:

```sh
u = User.find 1
u.events_created
```

Much clearer!

## Adding a Join Table (5 mins)

Next we need to create the relationship between events and users as attendees. Because this is a many to many relationship, we need to create a join table. In the terminal run:

```sh
rails g migration CreateJoinTableUsersEvents users events
rails db:migrate
```

Next we should update the `User` model in `app/models/user.rb`.

```ruby
class User < ApplicationRecord
  has_many :events_created, class_name: "Event", foreign_key: "user_id"
  has_and_belongs_to_many :events_attending, class_name: "Event", join_table: "events_users"
  has_many :comments
end
```

Update the `Event` model in `app/models/event.rb`.

```ruby
class Event < ApplicationRecord
  belongs_to :user
  has_many :comments
  has_and_belongs_to_many :attendees, class_name: "User", join_table: "events_users"
end
```

In the Rails console add a few more users.

```sh
ajay = User.create!(username: "ajaylard", email: "ajay.lard@ga.co")
mike = User.create!(username: "mickyginger", email: "mike.hayden@ga.co")
will = User.create!(username: "ruthlessamo", email: "will.hilton@ga.co")
```

We can grab the event and add users to the `attendees` array:

```sh
event = Event.find 1
event.attendees << ajay
event.attendees << mike
event.attendees << will
```

In order to get back the attendees for the event we can do:

```sh
event.attendees
```

You will get:

```sh
=> #<ActiveRecord::Associations::CollectionProxy [#<User id: 2, username: "ajaylard", email: "ajay.lard@ga.co", created_at: "2017-04-11 13:32:41", updated_at: "2017-04-11 13:32:41">, #<User id: 3, username: "mickyginger", email: "mike.hayden@ga.co", created_at: "2017-04-11 13:32:41", updated_at: "2017-04-11 13:32:41">, #<User id: 4, username: "ruthlessamo", email: "will.hilton@ga.co", created_at: "2017-04-11 13:32:41", updated_at: "2017-04-11 13:32:41">]>
```

In order to display the events that a user is attending we can do:

```sh
will.events_attending
```

And get back:

```sh
=> #<Event id: 1, name: "WDI25 Grad Ball", date: "2017-04-28", location: "Black Horse, Leman Street, London", user_id: 1, created_at: "2017-04-11 13:32:41", updated_at: "2017-04-11 13:32:41">
```

## Updating strong params (10 mins)

Now that we've created the join table, we need to update the strong params, so that the API will accept arrays of `attendee_ids` or `events_attending_ids`.

In the `users_controller.rb` file:

```ruby
def user_params
  params.require(:user).permit(:username, :email, events_attending_ids:[])
end
```

In the `events_controller.rb` file:

```ruby
def event_params
  params.require(:event).permit(:name, :date, :location, :user_id, attendee_ids:[])
end
```

## Creating a comment (5 mins)

Inside the Rails console, let's test that we can create comments with the correct relationships.

```sh
comment = Comment.create(body: "Amazing", user_id: 2, event_id: 1)
```

You will get back:

```sh
=> #<Comment id: 1, body: "Amazing", user_id: 2, created_at: "2017-04-11 13:40:50", updated_at: "2017-04-11 13:40:50", event_id: 1>
```

Notice that this has saved the ID of user who created it, and the ID of the event it relates to. This means that we could do `comment.user` and `comment.event`.

### Test in Insomnia

Make requests to the following URLs to make sure that you are getting data back from the API.

1. `http://localhost:3000/users`
2. `http://localhost:3000/events`
3. `http://localhost:3000/comments`

If we want to get back the events belonging to a user in the JSON, we will need to add serializers.

## Adding serializers (10 mins)

In your `Gemfile` add the following gem:

```ruby
gem 'active_model_serializers'
```

Then in the terminal:

```sh
bundle
rails g serializer User
rails g serializer Event
rails g serializer Comment
```

We didn't have the gem installed when we scaffolded earlier so these weren't generated automatically.

In the `User` serializer:

```ruby
class UserSerializer < ActiveModel::Serializer
  has_many :events_created
  has_many :events_attending
  attributes :id, :username, :email
end
```

In the `Event` serializer:

```ruby
class EventSerializer < ActiveModel::Serializer
  has_many :attendees
  belongs_to :user
  has_many :comments
  attributes :id, :name, :location, :date
end
```

In the `Comment` serializer:

```ruby
class CommentSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :event
  attributes :id, :body, :user
end
```

## Includes (10 mins)

If we wanted to display the comments on the events on the users index page, we should update the `users_controller.rb`:

```ruby
def index
  @users = User.all

  render json: @users, include: ['events_attending.comments', 'events_created.comments']
end
```

If we wanted to display who made those comments, we could do this:

```ruby
def index
  @users = User.all

  render json: @users, include: ['events_attending.comments', 'events_created.comments', 'events_attending.comments.user', 'events_created.comments.user']
end
```

This is a bit like doing `.populate()` with Mongoose

## Conclusion (5 mins)

Rails has been built with the RESTful design pattern at its core. It makes building simple relationships (`one-many`, `many-many`)

Being able to create more complex relationships with Rails is crucial as we build out more complex applications. By using the principals outlined above we can build out anything in Rails that we could with an Express app and a noSQL database.