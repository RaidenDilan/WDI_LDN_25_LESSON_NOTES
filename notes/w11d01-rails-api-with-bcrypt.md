---
title: Rails 5 API Bcrypt
type: lesson
duration: "1:25"
creator:
    name: Alex Chin
    city: London
competencies: Server Applications
---

# Rails 5 API Bcrypt

### Objectives
*After this lesson, students will be able to:*

- Protect a user model with bcrypt authentication
- Explain `has_secure_password`
- Set the foundation for creating JWT authentication

### Preparation
*Before this lesson, students should already be able to:*

- Must be able to make a Rails app
- Should be able to write Ruby
- Understand the concept of APIs

## Getting started (5 mins)

We're going to setup authentication in our Rails 5 twitter clone using the `bcrypt` gem.

The starter code has two models:

- user
- posts

It has JSON being serialized by ActiveModelSerializers and has CORS enabled.

### Why are we doing this? 

We're going to build the foundation for the next lesson where we are going to add JWT authentication ontop of this.

## Installing Bcrypt (10 mins)

Firstly, we're going to have to uncomment the `bcrypt` gem to our Gemfile:

```ruby
gem 'bcrypt', '~> 3.1.7'
```

Update our bundle with:

```ruby
$ bundle
```

### Add a migration to add fields to a user

We _already_ have a user model, however we want to add the field `email` and `password_digest`. For this, we are going to need a migration.

```bash
$ rails g migration AddEmailAndPasswordDigestToUser email password_digest
```

The field `password_digest` will be used to store the "hashed password", we will see what it looks like in a few seconds but know that the original password will never be stored. 

Let's check that migration:

```ruby
class AddEmailAndPasswordDigestToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :email, :string
    add_column :users, :password_digest, :string
  end
end
```

That looks great! Let's migrate the database:

```bash
$ rails db:migrate
```

### Update the Serializer

Normally, we might want to update the Serializer. However, in this case we don't actually want to output any of the new fields in our JSON. So in this case, we don't have to update anything.

### has_secure_password

Next, we need to add the `has_secure_password` method to the `User` model.

```ruby
class User < ApplicationRecord
  has_secure_password
  has_many :posts
  validates :username, presence: true
  validates :email, uniqueness: true, presence: true
end
```

This `has_secure_password` method does a few things for us:

1. Gives us two virtual properties `password` and `password_confirmation`
2. Hashes the password when it's stored in the database under the `password_digest` field
3. Provides a method to check a `password` against a `password_digest`
4. Validates `password_confirmation`

### Check that this works

We can check that we have installed this correctly using our rails terminal.

```bash
$ rails c

> user = User.create!(username: "dave", email: "dave@dave.com", password: "password", password_confirmation: "password")

> user.password_digest
=> "$2a$10$kwy05MEuq5vkqaHGPuoEB.ai6kakGb1gpzSC24zj1rcCO66507w/e"
```

Great! We can save our users with hashed passwords!

## Authentications controller (10 mins)

The next thing we need to do is to create a controller to handle:

- Register
- Login

We're going to call this `authentications_controller` and we can generate it with a Rails generator.

> **Note:** We could call this `sessions_controller` however, we're actually not going to be using sessions instead we're going to be using JWT tokens later so this might be a better naming convention.

```bash
$ rails g controller authentications register login
```

This should generate you:

- A controller with two empty actions
- Two routes in `config/routes.rb`

### Prefix our routes

We want to ensure our two endpoints are within our `api` scope:

- `POST /api/register`
- `POST /api/login`

So we need to update our `config/routes.rb` file. When we generated our controller, the default generation is going to give us `GET` endpoints in our `config/routes.rb`. We want to change these to be `POST`:

```ruby
Rails.application.routes.draw do
  scope :api do
    resources :users, except: [:create]
    resources :posts
    post 'register', to: 'authentications#register'
    post 'login', to: 'authentications#login'
  end
end
```

We can check this with:

```bash
$ rails routes
```

### Strong Params

When we generated our controller, we didn't give it any information about what params it want's to allow as part of any request to the server. We therefore need to write this by hand.

In `authentications_controller.rb` at the bottom, add:

```ruby
private
  def user_params
    Hash.new.merge! params.slice(:username, :email, :first_name, :last_name, :password, :password_confirmation)
  end
```

Here we are allowing all of the fields for a new user with the two virtuals that `has_secure_password` gives use. However, we don't want this to be within a user object:

Example JSON for register:

```json
{
  "email": "dave@dave.com", 
  "username": "david",
  "first_name": "Dave",
  "last_name": "Smith",
  "password": "password",
  "password_confirmation": "password"
}
```

## Register (10 mins)

Next, we need to write the register action. For this, we're simply going to:

1. Create a new user
2. Save the user
3. Return the user back if the user was saved
4. If the user wasn't saved, send back an errors object

```rb
  def register
    user = User.new(user_params)
    if user.save
      render json: user, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
```

> **Note:** We could render our errors with a custom ErrorSerializer as per this [blog](http://jaketrent.com/post/jsonapi-errors-serializer-in-rails/). However, this usually is only needed if your front-end expects a certain format of error.

### Test using Insomnia

If we fire up our API with:

```bash
$ rails s
```

We can try to register a user by making a "POST" request to: `http://localhost:3000/api/register`. The JSON data should look like:

```json
{
  "email": "claire@claire.com", 
  "username": "claire",
  "first_name": "Claire",
  "last_name": "Smith",
  "password": "password",
  "password_confirmation": "password"
}
```

If everything has worked out, we should get the response:

```json
{
  "id": 6,
  "username": "claire",
  "full_name": "Claire Smith",
  "posts": []
}
```

It should look like this:

<img width="937" alt="screen shot 2016-07-28 at 14 46 37" src="https://cloud.githubusercontent.com/assets/40461/17214716/2800fe60-54d2-11e6-97f9-abf6c291c067.png">

If we provide the incorrect details, we should get something like this:

<img width="937" alt="screen shot 2016-07-28 at 15 01 52" src="https://cloud.githubusercontent.com/assets/40461/17215273/3eb8e3dc-54d4-11e6-9cf3-d0a03b86b3f8.png">

### Check this user in the console

To ensure that this user has been correctly made and the password hashed, we can jump into the Rails console with:

```bash
$ rails c
```

And find the last user:

```
u = User.last
u.password_digest
```

We can then pretend to login with the `authenticate` method that was given to us by `has_secure_password`:

```rb
u = u.authenticate "password2"
=> false

u = u.authenticate "password"
=> #<User id: 6, username: "claire", first_name: "Claire", last_name: "Smith", created_at: "2016-07-28 13:45:56", updated_at: "2016-07-28 13:45:56", email: "claire@claire.com", password_digest: "$2a$10$ROYfa0AIWWyYvWtzbeLyLOrabmgRCwgpHgqHRLMfPAL...">
```

## Login (10 mins)

Next, we want to write the logic for logging into the app. In this action, we're going to:

1. Find a user with their email
2. Authenticate using their password
3. If there is a user, return the user
4. If there isn't return an error that doesn't describe what was wrong (more secure)

```ruby
def login
  user = User.find_by_email(params[:email])
  if user && user.authenticate(params[:password])
    render json: user, status: :ok
  else
    render json: { errors: ["Invalid login credentials."] }, status: 401
  end
end
```

> **Note:** The error code 401 is "Unauthorized".

### Test using Insomnia

Let's test this out in Insomnia by making a `POST` request to `http://localhost:3000/api/login`:

```json
{
  "email": "claire@claire.com", 
  "password": "password"
}
```

You should get the user back like this:

<img width="936" alt="screen shot 2016-07-28 at 15 09 04" src="https://cloud.githubusercontent.com/assets/40461/17215571/42d2515a-54d5-11e6-8410-4fa705b5f919.png">

If we put the wrong details into this request, then you get the JSON response:

```json
{
  "errors": [
    "Invalid login credentials."
  ]
}
```

<img width="935" alt="screen shot 2016-07-28 at 15 10 02" src="https://cloud.githubusercontent.com/assets/40461/17215618/6117223a-54d5-11e6-8baa-083b8fd1a2c3.png">

## Conclusion (5 mins)

We're building a foundation here to enable JWT authentication. That's what we're going to do next!

- What does `has_secure_password` give us?
- What is the status code 401
- Why don't we want to give the exact error when someone logs in?