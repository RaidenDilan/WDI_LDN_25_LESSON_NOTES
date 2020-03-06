---
title: Rails 5 API - JWT Authentication
type: lesson
duration: "1:25"
creator:
    name: Alex Chin
    city: London
competencies: Server Applications
---

# Rails 5 API - JWT Authentication

### Objectives
*After this lesson, students will be able to:*

- Learn how to setup JWT authentication in Rails
- Build the foundation for an Angular/Ember/React SPA Application
- Understand JWT vs Sessions

### Preparation
*Before this lesson, students should already be able to:*

- Must know how to create a Rails API
- Should understand the concept of authentication

## JWT Authentication in Rails API from scratch (10 mins)

In an earlier lesson, we looked at adding the `bcrypt` gem to a Rails API. Now we want to look at adding ontop of this JWT authentication.

There are a number of different ways of doing this in a Rails API with the 3 most popular being:

- [DeviseTokenAuth Gem ](https://github.com/lynndylanhurley/devise_token_auth)
- [Knock](https://github.com/nsarno/knock)
- [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper)
- Doing everything yourself

We're going to do the last one! Let's get started!

### Authentication in a Normal Rails app

Normally in a Rails API, authentication works with sessions like this:

1. Log-in a user
2. Store their unique user ID in session store
3. We store a session cookie in the browser that allows us to find this ID from the session store

As we are physically storing something on the server we say that the server has become **_stateful_** and there are some issues with this.

One of the key issues is to do with scaling and sharing of that session storage over time.

### JWT Authentication in a Rails API

What we want our server to do is to do authentication in a **_stateless_** way, i.e. Not storing anything on a the server.

The way that we're going to do this is:

1. User logs in and they are authenticated by the Rails app
2. If the user is authenticated, then the user is sent a unique JWT token
3. The client-side stores this token and sends back to the Rails app with every subsequent request
4. Rails then uses the token to lookup the current user
5. When someone logs out, the client-side deletes the token and subsequent requests do _not_ include that token.

### JWT authentication

#### What is JWT Authentication?

> JSON Web Token (JWT) Authentication is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.[*](https://tools.ietf.org/html/rfc7519)

In plain English, JWT allows us to authenticate requests between the client and the server by encrypting authentication information into a compact JSON object. 

Instead of, say, passing a user's own unique token (which we would need to persist to the database), or (god forbid), sending a user's raw email and password with every authentication request, JWT allows us to encrypt a user's identifying information, store it in a token, inside a JSON object, and include that object in every request that requires authentication.

#### JWT Encryption: How Does it Work?

JWT tokens are encrypted in three parts:

1. **The header:** the meta-data describing the encryption algorithm and type of token
2. **The payload:** the actual data concerning the user (id, email, etc.)
3. **The signature:** special combo of header info + payload to ensure that the sender of the token is really you!

## JWT Ruby Gem (10 mins)

In order to play with JWTs, we're going to us a gem called [jwt](https://github.com/jwt/ruby-jwt).

Let's install this and play with it before installing it in our Rails app:

```bash
$ gem install jwt
```

### Encoding

Now, we can go into `irb` and require this gem:

```bash
$ irb

> require "jwt"
=> true

> payload = {id: 123}
=> {:id=>123}

> secret = $onia%12d121212
=> "$onia%12d121212"

> token = JWT.encode(payload, secret)
=> "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIzfQ.Qsf6wiJs6Tnw3f5dED-ozgpRw-0iJ3eiTkWIh2bCMN4"
```

The library only requires 2 arguments but has an optional third:

- **Payload:** The content stored inside the JWT
- **Secret:** The unique secret code
- **Encryption algorithm:**, e.g. `HS256` (the default)

### Decoding

Similarly, to decode our token:

```bash
> JWT.decode(token, secret)
=> => [{"id"=>123}, {"typ"=>"JWT", "alg"=>"HS256"}]
```

Great! I hope you can now see that using these two functions we can implement a JWT authentication system in a Rails app quite easily!

## Getting started (5 mins)

The starter code we have has two models:

1. User
2. Posts

It is already hashing passwords using the `bcrypt` gem and the User model has the method `has_secure_password`.

Take a moment to familiarize yourself with the codebase.

## Making a JWT Library (25 mins)

We're going to need to regularly encode and decode JWT tokens. So what we're going to do is to create a plain old Ruby class (PORO), that will wrap up some of that functionality.

We'll put this class, which we'll call `Auth`, inside our `lib/` directory.

### Adding the gem

First, we need to add the `jwt` gem to our Gemfile:

```ruby
gem 'jwt'
```

Then update the bundle:

```bash
$ bundle
```

### Create Auth class

Next, create our new Auth class:

```bash
$ touch lib/auth.rb
```

Now, as we want other parts of our application to know about this new class in `lib/`, we want to add the `lib/` directory to the Rails autoload path.

This means when Rails starts, it will load this class so that other parts of the application that might make reference to it can know that it exists.

We do this in `config/application.rb`:

```
module Twitter
  class Application < Rails::Application
	.
	.
	.

    config.eager_load_paths << Rails.root.join('lib')
  end
end
```

### Define the class

Next, we want to define our Auth class and require `jwt`. We have to require `jwt` because if not the gem will be required further down Rails' `$LOAD_PATH`.

```ruby
require 'jwt'

class Auth
end
```

Next, we want to define two class methods:

1. `.issue` which will be responsible for creating JWTs
2. `.decode` which will be responsible for decoding JWTs

```ruby
require 'jwt'

class Auth
  def self.issue
  end

  def self.decode
  end
end
```

Great!

#### Generating a JWT: `Auth.issue`

This method will simply wrap the `JWT.encode` method that the jwt gem makes available to us. Remember it takes 3 arguments:

1. **The header:** the meta-data describing the encryption algorithm and type of token
2. **The payload:** the actual data concerning the user (id, email, etc.)
3. **The signature:** special combo of header info + payload to ensure that the sender of the token is really you!

### Creating a Hashing Key

Let's create an environment variable in our `.zshrc` file to store a secret. This will be a random string that we're going to use to issue the JWT.

```sh
export AUTH_SECRET='&3hksj3^bfdks3djkss'
```

Let's reload our `.zshrc` file: `source ~/.zshrc`

>**Note:** You'll need to do this on **all open terminal tabs**!
 
Now we can use this inside our `Auth` class:

```ruby
require 'jwt'

class Auth
  ALGORITHM = 'HS256'

  def self.issue(payload, expiry_in_minutes=60*24*30)
    payload[:exp] = expiry_in_minutes.minutes.from_now.to_i
    JWT.encode(payload, auth_secret, ALGORITHM)
  end

  def self.decode
  end

  def self.auth_secret
    ENV["AUTH_SECRET"]
  end
end
```

Notice that the hashing algorithm is stored in a class constant, `ALGORITHM`. This is because our `.decode` method will also need to access that information. Similarly, we've wrapped our accessing of the `ENV["AUTH_SECRET"]` in a method call, because we'll also need that data for our `.decode` method.

> **Note:** We also have set an expiry time on our JWT.

While we're here, let's define that decode method.

#### Decoding a JWT: `Auth.decode`

Next our `Auth.decode` method will simply wrap the `JWT.decode` method that the jwt gem makes available to us. This method takes in four arguments and returns an array:

- **Token:** The JWT that we want to decode,
- **Secret:** The hashing algorithm's secret key
- **Boolean:** Whether you want to validate the signature of the JWT or just decode the validation
- **Options hash:** 
	- The leeway, the amount of time before expiry claim expires that you allow (Must be numerical)
	- The type of hashing algorithm

```ruby
require 'jwt'

class Auth
  ALGORITHM = 'HS256'

  def self.issue(payload, expiry_in_minutes=60*24*30)
    payload[:exp] = expiry_in_minutes.minutes.from_now.to_i
    JWT.encode(payload, auth_secret, ALGORITHM)
  end

  def self.decode(token, leeway=0)
    decoded = JWT.decode(token, auth_secret, true, { leeway: leeway, algorithm: ALGORITHM })
    HashWithIndifferentAccess.new(decoded[0])
  end

  def self.auth_secret
    ENV["AUTH_SECRET"]
  end
end
```

> **Note:** We have used `HashWithIndifferentAccess` to access a hash with either strings or symbols as keys. In this example, we get strings as keys of our hash.

Okay, we're ready to use our Auth library in our controllers.

## Login & Register (10 mins)

Next, we need to return this JWT token after a user Register or Logs in.

In our `authentications_controller.rb`, we can generate a JWT token and send that in our login action:

```ruby
def login
  user = User.find_by_email(params[:email])
  if user && user.authenticate(params[:password])
    token = Auth.issue({ id: user.id })
    render json: { token: token, user: UserSerializer.new(user) }, status: :ok
  else
    render json: { errors: ["Invalid login credentials."] }, status: 401
  end
end
```

> **Note:** that we are encrypting the user's ID, not an email and password. This is because the user's ID is a unique identifier without being sensitive information (like a password).

> **Also Note:** We need to specify a serializer here because the user object is nested.

Then, we are sending the JWT back to the client-side app, as JSON, where it will be stored in `localStorage`.

Phew!

### Test with Insomnia

Let's try to test this with Insomnia. First, ensure we have the rails app running.

```bash
$ rails s
```

First can try to register to `POST http://localhost:3000/api/register` and with the data:

```json
{
    "username": "matt",
    "first_name": "Matt",
    "last_name": "Bradley",
    "email": "matt@matt.com", 
    "password": "password",
    "password_confirmation": "password"
}
```

Great. Now let's login to `POST http://localhost:3000/api/login`:

```json
{
  "email": "matt@matt.com", 
  "password": "password"
}
```

Great!

## Protecting our routes (20 mins)

Next, we need to protect all of the routes that we want to ensure that you need a valid JWT token to access.

As we're going to need these method in several controller, we're going to add them in the `ApplicationController`. There are several things we need to do in order to get this working.

1. We need a method to **extract the JWT** token from the request
2. We need to **decode that token** with our Auth class
3. Then we need to get the **find the user** using that decoded token
4. Lastly, we need to run a **before_action** that checks if there is a valid user found using the above method

Let's get started...

#### Adding methods to ApplicationController

As some of these methods will only be used by the class itself, some of them will be `private` methods.

First, lets get the token:

```ruby
class ApplicationController < ActionController::API

  private

    def token
      @token ||= if request.headers['Authorization'].present?
        request.headers['Authorization'].split.last
      end
    end
end
```

Next, we need a method to decode the token using the Auth class if a token was found:

```ruby
class ApplicationController < ActionController::API

  private

    def decoded_token
      @decoded_token ||= Auth.decode(token) if token
    end

    def token
      @token ||= if request.headers['Authorization'].present?
        request.headers['Authorization'].split.last
      end
    end
end
```

Next, we're going to make another method that checks if we have found a user id inside the decoded token:

```rb
class ApplicationController < ActionController::API

  private
  
    def id_found?
      token && decoded_token && decoded_token[:id]
    end

    def decoded_token
      @decoded_token ||= Auth.decode(token) if token
    end

    def token
      @token ||= if request.headers['Authorization'].present?
        request.headers['Authorization'].split.last
      end
    end
end
```

Then we need a method that finds the user, we're going to call this `current_user` and it might be used in other files so this one can't be private.

```ruby
class ApplicationController < ActionController::API

  def current_user
    @current_user ||= User.find(decoded_token[:id]) if id_found?
  rescue
    nil
  end

  private
  
    def id_found?
      token && decoded_token && decoded_token[:id]
    end

    def decoded_token
      @decoded_token ||= Auth.decode(token) if token
    end

    def token
      @token ||= if request.headers['Authorization'].present?
        request.headers['Authorization'].split.last
      end
    end
end
```

> **Note:** The JWT Ruby gem throws a number of different errors but we're just going to catch them all with `rescue` and then just return `nil`.

Lastly, we need to protect our routes with a `before_action`. This is a method that runs before any other controller action (as it's placed in our `application_controller.rb`). To do this, we're going to have to create two methods. One, to return the error and the other to check if there is a signed in user:

```ruby
class ApplicationController < ActionController::API
  before_action :authenticate_user!

  def authenticate_user!
    render json: { errors: ["Unauthorized"] }, status: 401 unless user_signed_in?
  end

  def user_signed_in?
    !!current_user
  end

  .
  .
  .
```

### Test it out!

Great! Now if we try to request a route using Insomnia, we should get a 401 (Unauthorized) error.

Ensure your app is running with:

```bash
$ rails s
```

Then make a `GET` request to `http://localhost:3000/api/posts`.

## We can't login or register?! (10 mins)

The problem with the app at the moment is that we can't login or register as these routes are also protected by this `authenticate_user!` method.

To get around this, we can use the method `skip_before_action` to literally skip this method in out `authentications_controller.rb`:

```ruby
class AuthenticationsController < ApplicationController
  skip_before_action :authenticate_user!
  .
  .
  .
```

Now, if you try to send a `POST http://localhost:3000/api/login` request with the correct details - you should be able to receive a JWT token back.

E.g.

```json
{
  "email": "matt@matt.com", 
  "password": "password"
}
```

Should give you:

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6N30.83heL1mGPNnFyefJMpNlIlGjlQLMUAaAmbuGKm2GvZE",
  "user": {
    "id": 7,
    "username": "matt",
    "full_name": "Matt Bradley",
    "posts": []
  }
}
```

### Testing a protected route

From this response, if you copy this token and add it to the "Headers" section of Insomnia, like this:

<img width="435" alt="screen shot 2016-07-28 at 20 42 01" src="https://cloud.githubusercontent.com/assets/40461/17226922/c44696dc-5503-11e6-81a2-b3a93bee0259.png">

Then you should be able to make a `GET` request to `http://localhost:3000/api/posts`.

## Conclusion (5 mins)

I understand that there is a lot of coding we've done here and it might take a little time to sink in. However, the process would be very similar if we were to execute this in another framework like Express.

- What was the Ruby JWT gem called?
- What gem did we used to create our environment variable?

### Further Reading

- [JSON Web Tokens Rails and React](http://adamalbrecht.com/2015/07/20/authentication-using-json-web-tokens-using-rails-and-react/)
- [JWT Authentication from Scratch](http://www.thegreatcodeadventure.com/jwt-auth-in-rails-from-scratch/)
- [Authentication with Knock](http://www.thegreatcodeadventure.com/jwt-authentication-with-rails-ember-part-i-rails-knock/)