![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Rails oAuth with Angular

Earlier we looked at how to set up Bcrypt with Rails, and how to issue and decode JWTs. Now we are going to add an Angular front end to the app, and then set up oAuth with Github.

> **Note:** This app will only have one page, that has both login and register forms on.

## Angular Setup

### Setting up Satellizer

Open up `starter-code`, `cd` into the `front-end` app, and run the following in the terminal:

```sh
yarn install
```

First of all let's set up Satellizer in order to login and register.

In the terminal run:

```sh
bower install satellizer --save
```

Inside `src/js/app.js` add the following:

```js
angular
  .module('twitter', ['satellizer'])
  .constant('API_URL', 'http://localhost:3000/api')
  .config(Auth)

Auth.$inject = ['$authProvider', 'API_URL'];
function Auth($authProvider, API_URL) {
  $authProvider.signupUrl = `${API_URL}/register`;
  $authProvider.loginUrl = `${API_URL}/login`;
}
```

Let's create a `LoginCtrl` to handle register and login. Attach the controller to the app at the top of the file, and then add the `LoginCtrl` below.

```js
angular
  .module('twitter', ['satellizer'])
  .constant('API_URL', 'http://localhost:3000/api')
  .config(Auth)
  .controller('LoginCtrl', LoginCtrl);

Auth.$inject = ['$authProvider', 'API_URL'];
function Auth($authProvider, API_URL) {
  $authProvider.signupUrl = `${API_URL}/register`;
  $authProvider.loginUrl = `${API_URL}/login`;
}

LoginCtrl.$inject = ['$auth'];
function LoginCtrl($auth) {
  const vm = this;

  function register() {
    $auth.signup(vm.user)
      .then(user => console.log(user));
  }

  vm.register = register;
}
```

### Adding the form

Let's initialize our Angular app by adding `ng-app` to the `<html>` tag, and `ng-controller` to the `<body>`. Then add the register form to the body.

```html
<!DOCTYPE html>
<html ng-app="twitter">
  <head>
    <meta charset="utf-8">
    <title>Angular Stack Setup</title>
    <!-- inject:js -->
    <!-- endinject -->
    <!-- inject:css -->
    <!-- endinject -->
  </head>
  <body ng-controller="LoginCtrl as login">
	<h1>Register</h1>
    <form ng-submit="login.register()">
      <div>
        <label>Username</label>
        <input type="text" ng-model="login.user.username">
      </div>

      <div>
        <label>Email</label>
        <input type="text" ng-model="login.user.email">
      </div>

      <div>
        <label>Password</label>
        <input type="password" ng-model="login.user.password">
      </div>

      <div>
        <label>Password Confirmation</label>
        <input type="password" ng-model="login.user.password_confirmation">
      </div>

      <button>Register</button>
    </form>

  </body>
</html>
```

Make sure that you are running your Rails server in the back end app, and test that you can register a new user. You should see the new user being returned in the Chrome console.

### Logging in

Add a login form to your `index.html`.

```html
<h1>Login</h1>
<form ng-submit="login.login()">
  <div>
    <label>Email</label>
    <input type="text" ng-model="login.credentials.email">
  </div>

  <div>
    <label>Password</label>
    <input type="password" ng-model="login.credentials.password">
  </div>

  <button>Login</button>
</form>
```

Add a login function to the `LoginCtrl`. Inside `src/js/app.js`:

```js
LoginCtrl.$inject = ['$auth'];
function LoginCtrl($auth) {
  const vm = this;

  function register() {
    $auth.signup(vm.user)
      .then(user => console.log(user));
  }

  vm.register = register;

  function login() {
    $auth.login(vm.credentials)
      .then(user => console.log(user));
  }

  vm.login = login;
}
```

### oAuth with Github

Update the `Auth` config to be:

```js
Auth.$inject = ['$authProvider', 'API_URL'];
function Auth($authProvider, API_URL) {
  $authProvider.signupUrl = `${API_URL}/register`;
  $authProvider.loginUrl = `${API_URL}/login`;

  $authProvider.github({
    clientId: '',
    url: `${API_URL}/oauth/github`
  });
}
```

Add the following `authenticate` function into the `LoginCtrl`:

```js
function authenticate(provider) {
  $auth.authenticate(provider)
    .then(user => console.log(user));
}

vm.authenticate = authenticate;
```

In `index.html` add a Login with Github button underneath your login form. You should make sure it is outside of the closing form tag.

```html
<button ng-click="login.authenticate('github')">Login with Github</button>
```

If you click on the button in Chrome, you should get a popup that says asks you if you want to authorize this app (if this is a brand new set of keys), and then it will give you the following error in the console.

![oAuth error](http://i.imgur.com/kQGL4xQ.png)

## Rails Setup

We need to generate an oauth controller in our Rails app. In the terminal, from inside the Rails app, run:

```sh
rails g controller oauth github
```

We are going to use a gem called `httparty` to make server side requests, so we need to add this to our `Gemfile`.

```ruby
gem 'httparty'
```

Then run `bundle` in the terminal.

### Requesting the access token

Inside our new `controllers/oauth_controller.rb` file, add the following:

```ruby
class OauthController < ApplicationController
  def github
    token = HTTParty.post('https://github.com/login/oauth/access_token', {
      query: {
        client_id: ENV["GITHUB_CLIENT_ID"],
        client_secret: ENV["GITHUB_CLIENT_SECRET"],
        code: params[:code]
      },
      headers: { 'Accept' => 'application/json'}
    })

    p token
  end
end
```

Inside the headers we are telling Github that we are only interested in JSON, so that they will send us back a JSON response.

Inside `config/routes.rb` we need to update our route for the `github` method.

Move the `oauth/github` route from here:

```ruby
Rails.application.routes.draw do
  get 'oauth/github'

  scope :api do
    resources :users, except: [:create]
    resources :posts
    post 'register', to: 'authentications#register'
    post 'login', to: 'authentications#login'
  end
end
```

To here:

```ruby
Rails.application.routes.draw do
  scope :api do
    resources :users, except: [:create]
    resources :posts
    post 'register', to: 'authentications#register'
    post 'login', to: 'authentications#login'
    post 'oauth/github', to: 'oauth#github'
  end
end
```

We also need to add a `skip_before_action` to our `oauth` controller, so that we don't have to be logged in to log in!

```ruby
class OauthController < ApplicationController
  skip_before_action :authenticate_user!
  
  ...
```

If you hit the "Login with Github" button now you should get the response logging in the terminal, that contains the `access_token` along with some other information. We are going to use this token to request the user's profile information.

### Request the user's profile

We need to make a second `HTTParty` request in order to get back the user's profile. Update the `oauth` controller:

```ruby
class OauthController < ApplicationController
  skip_before_action :authenticate_user!

  def github
    token = HTTParty.post('https://github.com/login/oauth/access_token', {
      query: {
        client_id: ENV["GITHUB_CLIENT_ID"],
        client_secret: ENV["GITHUB_CLIENT_SECRET"],
        code: params[:code]
      },
      headers: { 'Accept' => 'application/json'}
    }).parsed_response

    profile = HTTParty.get('https://api.github.com/user', {
      query: token,
      headers: { 'User-Agent' => 'HTTParty', 'Accept' => 'application/json' }
    }).parsed_response
    
    p profile
  end
end
```

Click on "Login with Github" and check the terminal. You should see the profile information being returned, including `avatar_url` and `login` (username).

### Creating or updating a user

Now that we have all of the information we need, we either want to create a new user if they've never logged in before, or update a user with their Github ID if they've already registered with that email. We need to add a new field to the users table to store the Github ID.

In the terminal run:

```sh
rails g migration AddGithubIdToUser github_id:integer
```

You should get a migration that look like this:

```ruby
class AddGithubIdToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :github_id, :integer
  end
end
```

To run this migration run:

```sh
rails db:migrate
```

Inside the `oauth_controller`, add the following underneath where we've stored the profile.

```ruby
user = User.where("email = :email OR github_id = :github_id", email: profile["email"], github_id: profile["id"]).first
```

If we don't find a user, we want to create  a new user, so underneath this line, we want to add the following.

```ruby
user = User.new username: profile["login"], email: [profile["email"]] unless user

user[:github_id] = profile["id"]

p user
```

Whether or not we find a user in the database or not, we want to make sure that we attach the Github ID to their record. We can then print the user and check in the console. We should see something like this:

```sh
#<User id: nil, username: "eisacke", first_name: nil, last_name: nil, created_at: nil, updated_at: nil, email: "[nil]", password_digest: nil, github_id: 12997768>
```

Next we want to save our user, and handle any errors. Underneath add:

```ruby
if user.save
  token = Auth.issue({ id: user.id })
  render json: { user: UserSerializer.new(user), token: token }, status: :ok
else
  render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
end
```

You should see the following error in your console.

![oAuth 422 Error](http://i.imgur.com/pdYKBoJ.png)

We see this error because `has_secure_password` is running some validations for us, to check if we have a password. If you inspect the reponse in the network tab.

### Updating User model

We need to update our User model now to stop the `has_secure_password` validations from running, and add our own instead:

```ruby
class User < ApplicationRecord
  has_secure_password validations: false
  has_many :posts
  validates :username, presence: true
  validates :email, presence: true, uniqueness: true, unless: :oauth_login?
  validates :password, presence: true, confirmation: true, unless: :oauth_login?, on: :create

  def oauth_login?
    github_id.present?
  end
end

```

We only want to check if the email and password are present if we are not logging in using oAuth. 

We are also only checking that they have a password `on: :create`, which means that a user only has to enter their password when they first create their account.

You should now be able to log in with Github, and get a token stored inside your local storage.



