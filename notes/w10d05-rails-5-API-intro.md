---
title: Rails 5 API Introduction
type: lesson
duration: "1:25"
creator:
    name: Alex Chin
    city: London
competencies: Server Applications
---

# Rails 5 API Introduction

### Objectives
*After this lesson, students will be able to:*

- Build an API with Rails 5
- Use ActiveModelSerializer to serialize data
- Enable CORS

### Preparation
*Before this lesson, students should already be able to:*

- Must be able to make a Rails app
- Should be able to write Ruby
- Understand the concept of APIs

## What is an API Application?

Traditionally, when people said that they used Rails as an "API", they meant providing a programmatically accessible API alongside their web application. For example, GitHub provides [an API](https://developer.github.com/) that you can use from your own custom clients.

With the advent of client-side frameworks, more developers are using Rails to build a back-end that is shared between their web application and other native applications.

For example, Twitter uses its [public API](https://dev.twitter.com/) in its web application, which is built as a static site that consumes JSON resources.

Instead of using Rails to generate HTML that communicates with the server through forms and links, many developers are treating their web application as just an API client delivered as HTML with JavaScript that consumes a JSON API.

## Why Use Rails for JSON APIs?

The first question a lot of people have when thinking about building a JSON API using Rails is: "isn't using Rails to spit out some JSON overkill? Shouldn't I just use something like Sinatra?".

For very simple APIs, this may be true. However, even in very HTML-heavy applications, most of an application's logic lives outside of the view layer.

The reason most people use Rails is that it provides a set of defaults that allows developers to get up and running quickly, without having to make a lot of trivial decisions.

Let's take a look at some of the things that Rails provides out of the box that are still applicable to API applications.

### Handled at the middleware layer:

- **Reloading:** Rails applications support transparent reloading. This works even if your application gets big and restarting the server for every request becomes non-viable.
- **Development Mode:** Rails applications come with smart defaults for development, making development pleasant without compromising production-time performance.
- **Test Mode:** Ditto development mode.
- **Logging:** Rails applications log every request, with a level of verbosity appropriate for the current mode. Rails logs in development include information about the request environment, database queries, and basic performance information.
- **Security:** Rails detects and thwarts [IP spoofing](https://en.wikipedia.org/wiki/IP_address_spoofing) attacks and handles cryptographic signatures in a [timing attack](https://en.wikipedia.org/wiki/Timing_attack) aware way. Don't know what an IP spoofing attack or a timing attack is? Exactly.
- **Parameter Parsing:** Want to specify your parameters as JSON instead of as a URL-encoded String? No problem. Rails will decode the JSON for you and make it available in params. Want to use nested URL-encoded parameters? That works too.
- **Conditional GETs:** Rails handles conditional GET (ETag and Last-Modified) processing request headers and returning the correct response headers and status code. All you need to do is use the [stale?](http://api.rubyonrails.org/classes/ActionController/ConditionalGet.html#method-i-stale-3F) check in your controller, and Rails will handle all of the HTTP details for you.
- **HEAD requests:** Rails will transparently convert HEAD requests into GET ones, and return just the headers on the way out. This makes HEAD work reliably in all Rails APIs.

While you could obviously build these up in terms of existing Rack middleware, this list demonstrates that the default Rails middleware stack provides a lot of value, even if you're **_"just generating JSON"_**.

### Handled at the Action Pack layer:

- **Resourceful Routing:** If you're building a RESTful JSON API, you want to be using the Rails router. Clean and conventional mapping from HTTP to controllers means not having to spend time thinking about how to model your API in terms of HTTP.
- **URL Generation:** The flip side of routing is URL generation. A good API based on HTTP includes URLs (see the [GitHub Gist API](https://developer.github.com/v3/gists/) for an example).
- **Header and Redirection Responses:** head `:no_content` and `redirect_to user_url(current_user)` come in handy. Sure, you could manually add the response headers, but why?
- **Caching:** Rails provides page, action and fragment caching. Fragment caching is especially helpful when building up a nested JSON object.
- **Basic, Digest, and Token Authentication:** Rails comes with out-of-the-box support for three kinds of HTTP authentication.
- **Instrumentation:** Rails has an instrumentation API that triggers registered handlers for a variety of events, such as action processing, sending a file or data, redirection, and database queries. The payload of each event comes with relevant information (for the action processing event, the payload includes the controller, action, parameters, request format, request method and the request's full path).
- **Generators:** It is often handy to generate a resource and get your model, controller, test stubs, and routes created for you in a single command for further tweaking. Same for migrations and others.
- **Plugins:** Many third-party libraries come with support for Rails that reduce or eliminate the cost of setting up and gluing together the library and the web framework. This includes things like overriding default generators, adding Rake tasks, and honoring Rails choices (like the logger and cache back-end).

Of course, the Rails boot process also glues together all registered components. For example, the Rails boot process is what uses your `config/database.yml` file when configuring Active Record.

The short version is: you may not have thought about which parts of Rails are still applicable even if you remove the view layer, but the answer turns out to be most of it.

## Rails-API Gem (10 mins)

For a while it wasn't possible to make a "stripped-down" version of a Rails application without the extra bloat. However, this inspired a gem called [`rails-api`](https://github.com/rails-api/rails-api).

Rails-api was created and by [Yehuda Katz](https://github.com/wycats), [José Valim](https://github.com/josevalim), [Carlos Antonio Da Silva](https://github.com/carlosantoniodasilva), [Santiago Pastorino](https://github.com/spastorino), Rails Core team members, and all-around great Rubyist [Steve Klabnik](http://www.steveklabnik.com/).

For a while, people could use this. However, now in Rails 5, the `rails-api` gem now ships as part of the Rails 5 core. Thus making Rails now an ideal candidate for building streamlined APIs quickly and easily.

### Other options

Out in the wild, you might see other tools that have been used to make Ruby APIs. The two most popular being:

- [Grape](https://github.com/ruby-grape/grape)
- [Sinatra](http://www.sinatrarb.com/)

## Making an API with `--api` (20 mins)

We're going to make small clone of a twitter API looking at:

- Rails 5's new `--api` option
- A gem to control our JSON output called ActiveModelSerializer
- Enabling CORS in our Rails application

First, make sure you are running Ruby 2.2.2+ or newer as it’s required by Rails 5.

Next, let's ensure we have Rails5 installed:

```bash
$ gem list rails

rails (5.0.0, 4.2.6)
```

> **Note:** If you don't have Rails 5

> Now that it's officially released, you can just install the latest version of Rails with:

> ```bash
$ gem install rails
```

According to the official Rails guide all we need to do to create an API only Rails app is to pass the `--api` option at the command line when creating a new Rails app, like so:

```bash
$ rails new twitter -d postgresql --api 
```

> **Note:** If the installation fails when the Rails app bundles, you might have to run install: 

>```bash
$ brew uninstall xz
$ gem install nokogiri -v 1.6.8
```

>Then run:

>```bash
$ bundle
```

Then we need to `cd` into the rails app:

```bash
$ cd twitter
```

### Rake vs Rails

In Rails 5, the normal Rails 4 rake commands are now prefixed by `rails` instead of `rake`. (This was contended by a lot of Rails developers... but DHH wanted this to happen - so it did).

So to create our database we can now do:

```bash
$ rails db:create
```

Nice! Now we have a shiny new API only Rails app without any of the incumbent front end bloat, and all of the inherent Railsy goodness.

### Rails API vs Standard Rails

There are some changes in the generated Gemfile. We can notice that stuff related with asset management and template rendering is not longer present:

- `coffee-rails`
- `jquery-rails`
- `sass-rails`
- `uglifier`
- `turbolinks`
- `web-console`
- `sprockets`

We also don't have these files and folders anymore:

- `app/assets/`
- `lib/assets/`
- `vendor/assets/`
- `app/helpers/`
- `app/views/layouts/application.html.erb`

Let’s now check out the config/application.rb file:

```
....
....

module Twitter
  class Application < Rails::Application

    ....
    ....

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
  end
end
```

The `api_only` config option makes posible to have our Rails application working excluding those middlewares and controller modules that are not needed in an API only application.

Last but not least, our main ApplicationController is defined slightly different:

```ruby
class ApplicationController < ActionController::API
end
```

Please note that `ApplicationController` inherits from `ActionController::API`. Remember that Rails standard applications have their controllers inheriting from `ActionController::Base` instead.

## Serializing API Output (15 mins)

In it’s current state, if we made some models and controllers, our app will just spit out a JSON representation of every column in the database. This is perhaps not what we want, so we need a way to control what JSON data gets served through the API.

Normally, Rails would suggest we would use a front end templating engine such as `jbuilder` for this purpose, but since we’re not using views in our super streamlined API app, that’s not going to be an option.

> **Note:** Some people (David Heinemeier Hansson) consider JSON to be a template of our data and some people consider it to be a representation of the data itself.

### What does ActiveModelSerializer do?

The purpose of `ActiveModel::Serializers` is to provide an object to encapsulate serialization of ActiveModel objects, including ActiveRecord objects.

Serializers know about both a model and the `current_user`, so you can customize serialization based upon whether a user is authorized to see the content.

In short, serializers replace hash-driven development with object-oriented development.

### Who made AMS?

While not busy working on Rails or the Rails API Gem, the same guys who made the Rails-API gem found the time to also put together the [active_model_serializer](https://github.com/rails-api/active_model_serializers) gem to make it easier to format JSON responses when using Rails as an API server.

### Install the gem

Go ahead and add the `active_model_serializers` gem to your Gemfile:

```ruby
gem 'active_model_serializers'
```

Update your bundle:

```bash
$ bundle
```

### Do this before any scaffolding

We can create a serializer for our User model using the generator command:

```bash
$ rails g serializer user
```

However, if we install `'active_model_serializers'` **before** running any scaffold commands - serializers will be generated with other scaffolded files.

## Scaffolding (10 mins)

As this is a quick initial look at the API tools we have to play with in Rails, we're going to use a scaffold command to generate a couple of resources:

When an app is created with the `--api` flag you can use the default scaffold generators to generate your API resources as normal, without the need for any special arguments.

```bash
$ rails g scaffold User username first_name last_name 
$ rails g scaffold Post user:references body:text
```

Great! This will have created us the routes and setup the controllers. However, we still have pending migrations that we need to run:

```bash
$ rails db:migrate
```

### Add the relationships

The `user:references` will have added the relationship for a post:

```ruby
class Post < ApplicationRecord
  belongs_to :user
end
```

However, we want to add the corresponding relationhsip in the User model:

```ruby
class User < ApplicationRecord
  has_many :posts
end
```

### Add some validations

It's always good to have some validations in the models:

In `app/models/user.rb:

```ruby
class User < ApplicationRecord
  has_many :posts
  validates :username, presence: true, uniqueness: true
end
```

In `app/models/post.rb`:

```ruby
class Post < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :body, length: { minimum: 0, maximum: 142 }, allow_blank: false
end
```

### Controllers

Let's have a look at one of the controllers that were generated, `app/users_controller.rb`:

We can see that the actions are now only rendering JSON instead of rendering the HTML too:

```ruby
def index
  @users = User.all

  render json: @users
end
```

## Seed some data

Let's seed some users and posts to check the JSON output of this new API. Inside, `db/seeds.rb` let's add:

```ruby
u1 = User.create!(username: "alex", first_name: "Alex", last_name: "Chin")
u2 = User.create!(username: "mike", first_name: "Mike", last_name: "Hayden")
u3 = User.create!(username: "rane", first_name: "Rane", last_name: "Gowan")

p1 = u1.posts.create!(body: "I bet we could stick angular ontop of this API...")
p2 = u2.posts.create!(body: "This is quite fast to make a quick API!")
p3 = u1.posts.create!(body: "This could be a fun stack for a final project?")
p4 = u3.posts.create!(body: "I like using Rails!")
```

Now let's run:

```bash
$ rails db:seed
```

Great! 

### Let's see this working

Fire up the server with:

```bash
$ rails s
```

And visit:

- `http://localhost:3000/users`
- `http://localhost:3000/posts`

Great!

## Customizing JSON output (20 mins)

In `app/serializers/user_serializer.rb`, we find this code:

```ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :first_name, :last_name
end
```

> **Note:** When you generate a serializer with `rails g serializer user` then only the `:id` attribute is added by default.

### Change the output

Let's test the serializer is working by removing everything apart from the `:id` field:

```ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id
end
```

Fire up the server with:

```bash
$ rails s
```

And navigate to `http://localhost:3000/users`. You should see:

```json
[
  {
    "id": 1
  },
  {
    "id": 2
  },
  {
    "id": 3
  }
]
```

That’s not going to be much use to us, so go ahead and add back the `:username`, `:first_name`, `:last_name` attributes to the serializer:

```ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :first_name, :last_name
end
```

Great!

### Methods

We can also create a method in this serializer and add that to the serializer. Let's make a method for to output the full name of the user:

```ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :full_name

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end
```

We need to use the reserved work `object` to refer to an object in the JSON output.

You should now see:

```json
[
  {
    "id": 1,
    "username": "alex",
    "full_name": "Alex Chin"
  },
  {
    "id": 2,
    "username": "mike",
    "full_name": "Mike Hayden"
  },
  {
    "id": 3,
    "username": "rane",
    "full_name": "Rane Gowan"
  }
]
```

### Relationships in the JSON

If we wanted to reflect the relationship between posts and users in the serialized JSON output - it's so easy!

All you need to do is to add the same relationship as you would in your model.

```ruby
class UserSerializer < ActiveModel::Serializer
  has_many :posts
  attributes :id, :username, :full_name

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end
```

If you visit `http://localhost:3000/users`, you should now see that the posts have been added to the users endpoint:

```
[
  {
    "id": 1,
    "username": "alex",
    "full_name": "Alex Chin",
    "posts": [
      {
        "id": 1,
        "user_id": 1,
        "body": "I bet we could stick angular ontop of this API...",
        "created_at": "2016-07-27T11:47:45.860Z",
        "updated_at": "2016-07-27T11:47:45.860Z"
      },
      {
        "id": 3,
        "user_id": 1,
        "body": "This could be a fun stack for a final project?",
        "created_at": "2016-07-27T11:47:45.867Z",
        "updated_at": "2016-07-27T11:47:45.867Z"
      }
    ]
  },
  .
  .
  .
```

That's great!

## Namespacing our API (10 mins)

If we want to namespace our API with urls that look like this: `http://localhost:3000/api/users` there are several ways to do it.

If we go to our `config/routes.rb` file - we can wrap our routes in a scope:

```ruby
Rails.application.routes.draw do
  scope :api do
    resources :posts
    resources :users
  end
end
```

> **Note:** Scaffolds won't automatically add new resources into the api scope.

If you visit `http://localhost:3000/users`, you should now see:

```
{
"status": 404,
"error": "Not Found",
"exception": "#<ActionController::RoutingError: No route matches [GET] \"/users\">",
.
.
.
```

However, if you visit `http://localhost:3000/api/users` - you should be fine.

### Versioning

If you were going to make a production application. We might actually create versions of our API, for example `http://localhost:3000/api/v1/users`.

However, we don't need to do this at the moment.

## Enabling CORS (15 mins)

If you’re building a public API you’ll probably want to enable Cross-Origin Resource Sharing (CORS). 

### Why is CORS important?

JavaScript and the web programming has grown by leaps and bounds over the years, but the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) still remains. This prevents JavaScript from making requests across domain boundaries, and has spawned various hacks for making cross-domain requests.

At the moment, this is not possible.

### Test this out

Let's make a quick html website to check what we get:

```bash
$ mkdir ajax-test && ajax-test
$ touch index.html
```

To the index.html you can add:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AJAX Test</title>
</head>
<body>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <script>
    $.get("http://localhost:3000/api/users").done(function(res){
      console.log(res);
    });
  </script>
</body>
</html>
```

You should see the error:

```
XMLHttpRequest cannot load http://localhost:3000/api/users. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

### Adding `rack-cors`

This is made very simple by the [`rack-cors` gem](https://github.com/cyu/rack-cors). Just uncomment it in your Gemfile like so:

```ruby
gem 'rack-cors'
```

Update your bundle:

```bash
$ bundle
```

### Configuring in `config/application.rb`

And put something like the code below in `config/application.rb` of your Rails application. For example, this will allow GET, POST or OPTIONS requests from any origin on any resource.

```ruby
.
.
.
module Twitter
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :options]
      end
    end
  end
end
```

> **Note:** You have to restart the rails server to make this work.

### Test this out

If you check the page that is making the ajax request - you should now see the Array of users being output.

## Independent Practice (20 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

Customize the `http://localhost:3000/api/posts` serializer to also output: 

- the number of characters that were used in the body of the tweet.
- the url of that tweet

### Answer:

```ruby
class PostSerializer < ActiveModel::Serializer
  attributes :id, :body, :length, :url
  has_one :user

  def length
    object.body.length
  end

  def url
    Rails.application.routes.url_helpers.post_url object, only_path: true
  end
end
```

## Conclusion (5 mins)

ActiveModelSerializers are just one way of customizing your JSON output in your Rails API.

Using Rails 5 with the `--api` flag is a really quick way to spin up an API.

We'll be looking at how to integrate this with Angular in later lessons.

### Further reading

- [Using Rails API](http://edgeguides.rubyonrails.org/api_app.html)
- [Building the perfect Rails 5 API](http://sourcey.com/building-the-prefect-rails-5-api-only-app/)
- [How to make Rails 5 API Only](https://hashrocket.com/blog/posts/how-to-make-rails-5-api-only)
- [Building a super simple Rails API](http://www.thegreatcodeadventure.com/building-a-super-simple-rails-api/)