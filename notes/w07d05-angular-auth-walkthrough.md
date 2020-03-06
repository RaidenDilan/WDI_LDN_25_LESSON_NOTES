![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Authentication with Angular & Express - Walkthrough

### Express Authentication

Open up the `starter-code` and `npm i`. We have a `User` model already, but we need to set up our routes.

```bash
touch controllers/auth.js
```

This is where we will put our functions for logging in and registering.

In `controllers/auth.js`:

```js
const User = require('../models/user');

function register(req, res, next) {
  User
    .create(req.body)
    .then(() => res.json({ message: 'Registration successful'}))
    .catch(next);
}

function login(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) return res.unauthorized();

      // Generate a JWT and send it to the user
    });
}

module.exports = {
  register,
  login
};
```

Before we can generate our JWT we need to install `bcrypt` and `jsonwebtoken` using `npm`.

```bash
npm i --save jsonwebtoken bcrypt
```

In `controllers/auth.js` add the following underneath where you're required your `User` model:

```js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');
```

Now we can update the `login` function to be:

```js
function login(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) return res.unauthorized();

      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1hr' });
      res.json({ token, message: `Welcome back ${user.username}` });
    })
    .catch(next);
}
```

In `config/routes.js` require your `auth` controller:

```js
const auth = require('../controllers/auth');
```

Add routes to handle `POST` requests to `/register` and `/login`:

```js
router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);
```

We can now test that our authentication routes are working using Insomnia. To test register, make a `POST` request to `http://localhost:7000/api/register` and in the body send some test data:

```js
{
  "username": "ajay",
  "email": "ajay.lard@ga.co",
  "password": "password",
  "passwordConfirmation": "password"
}
```

You should get back a `200 OK` response, along with the following:

```js
{
  "message": "Registration successful"
}
```

Now let's test the login. Make a `POST` request to `http://localhost:7000/api/login` and send in the details that we've just registered with:


```js
{
  "email": "ajay.lard@ga.co",
  "password": "password"
}
```

We should get back a `200 OK` reponse along with the following:

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGNiYjNiZWMxODJhNWZlYmFkMmNkOWMiLCJpYXQiOjE0ODk3NDYwMzMsImV4cCI6MTQ4OTc0OTYzM30.rvMFChimt-3joEtF60Mngeosb6LbiRFT98-TzP7n7g4",
  "message": "Welcome back ajay"
}
```

We need to stop users from accessing the birds unless they are logged in. We need to create a `secureRoute` function. In the terminal:

```bash
touch lib/secureRoute.js
```

Inside `lib/secureRoute.js`:

```js
const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { secret } = require('../config/environment');
const User = require('../models/user');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.unauthorized();

  const token = req.headers.authorization.replace('Bearer ', '');

  jwt
    .verifyAsync(token, secret)
    .then((payload) => {
      return User.findById(payload.userId);
    })
    .then((user) => {
      if(!user) return res.unauthorized();
      req.user = user;
      return next();
    })
    .catch(next);
}

module.exports = secureRoute;
```

Inside `config/routes.js` require the `secureRoute` method:

```js
const secureRoute = require('../lib/secureRoute');
```

Then, update your `/birds` routes to use the `secureRoute`.

```js
router.route('/birds')
  .all(secureRoute)
  .get(birds.index)
  .post(birds.create);

router.route('/birds/:id')
  .all(secureRoute)
  .get(birds.show)
  .put(birds.update)
  .delete(birds.delete);
```

Here we are saying that only users who send a valid token with their request can access any of these routes. To test this in Insomnia, we should take the token that was generated when we logged in and add a 'Header' to our request.

Click on the 'Headers' tab, and add an 'Authorization' header with the value of 'Bearer', followed by a space, and then your token (without quotations).

<img src="http://i.imgur.com/hLch05Z.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

### Angular Authentication

Install [Satellizer](https://github.com/sahat/satellizer) to your project using `bower`:

```bash
bower install --save satellizer
```

Inject it into your Angular dependencies:

```js
angular
  .module('birdApp', ['ui.router', 'ngResource', 'satellizer']);
```

We need to create a configuration file for Satellizer in our `src/js/config` folder:

```bash
touch src/js/config/satellizer.js
```

Inside `src/js/config/satellizer.js`:

```js
angular
  .module('birdApp')
  .config(Auth);

Auth.$inject = ['$authProvider'];
function Auth($authProvider) {
  $authProvider.signupUrl = '/api/register';
  $authProvider.loginUrl = '/api/login';
}
```

We also need to create an Angular controller to handle authorization:

```js
touch src/js/controllers/auth.js
```

Inside `src/js/controllers/auth.js`:

```js
angular
  .module('birdApp')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$auth', '$state'];
function LoginCtrl($auth, $state) {
  const vm = this;
  vm.credentials = {};

  function submit() {
    $auth.login(vm.credentials)
      .then(() => $state.go('birdsIndex'));
  }

  vm.submit = submit;
}
```

We need to create a view to put our login form in.

```bash
mkdir src/js/views/auth
touch src/js/views/auth/login.html
```

Add the following HTML to the new `login.html` view:

```html
<form ng-submit="login.submit()">
  <div>
    <label for="email">Email</label>
    <input type="text" name="email" id="email" ng-model="login.credentials.email">
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" ng-model="login.credentials.password">
  </div>

  <button>Login</button>
</form>
```

We now need to add a `login` state to our `router.js` file. Inside `src/js/config/router.js`, underneath the `birdsEdit` state add:

```js
.state('login', {
  url: '/login',
  templateUrl: 'js/views/auth/login.html',
  controller: 'LoginCtrl as login'
});
```

> Note: Remember to remove the semi-colon from the end of the line above.

Test that this is working by going to `http://localhost:7000/login` in Chrome and logging in with the credientials you have registered with. You should be redirected to the birds index page.

Create a state for register. Inside `src/js/config/router.js`:

```js
.state('register', {
  url: '/register',
  templateUrl: 'js/views/auth/register.html',
  controller: 'RegisterCtrl as register'
});
```

In `src/js/controllers/auth.js` add a controller for register:

```js
angular
  .module('birdApp')
  .controller('RegisterCtrl', RegisterCtrl)
  .controller('LoginCtrl', LoginCtrl);

RegisterCtrl.$inject = ['$auth', '$state'];
function RegisterCtrl($auth, $state) {
  const vm = this;
  vm.user = {};

  function submit() {
    $auth.signup(vm.user)
      .then(() => $state.go('login'));
  }

  vm.submit = submit;
}
```

Create a view for the register form:

```bash
touch src/js/views/auth/register.html 
```

Add the following HTML:

```html
<form ng-submit="register.submit()">
  <div>
    <label for="username">Username</label>
    <input type="text" name="username" id="username" ng-model="register.user.username">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="text" name="email" id="email" ng-model="register.user.email">
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" ng-model="register.user.password">
  </div>
  <div>
    <label for="passwordConfirmation">Password Confirmation</label>
    <input type="password" name="passwordConfirmation" id="passwordConfirmation" ng-model="register.user.passwordConfirmation">
  </div>

  <button>Register</button>
</form>
```

Test that it works by navigating to `http://localhost:7000/register` and registering a new user with brand new credentials. You should be taken to the login page, where you can then log in with those same credentials.

### Error Handling

In order to handle our errors, we need to create an interceptor. This is like middleware, but for AJAX requests.

In the terminal:

```bash
touch src/js/factories/errorHandler.js
```

Inside `src/js/factories/errorHandler.js`:

```js
angular
  .module('birdApp')
  .factory('ErrorHandler', ErrorHandler);

ErrorHandler.$inject = ['$rootScope'];
function ErrorHandler($rootScope) {
  return {
    responseError: function(err) {
      $rootScope.$broadcast('error', err);
    }
  };
}
```

We need to create a config file for the interceptors. In the terminal:

```bash
touch src/js/config/interceptors.js
```

In `src/js/config/interceptors.js`:

```js
angular
  .module('birdApp')
  .config(Interceptors);

Interceptors.$inject = ['$httpProvider'];
function Interceptors($httpProvider) {
  $httpProvider.interceptors.push('ErrorHandler');
}
```

Create a controller that we are going to wrap around the whole app. In ther terminal:

```bash
touch src/js/controllers/main.js
```

Inside `src/js/controllers/main.js`:

```js
angular
  .module('birdApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope'];
function MainCtrl($rootScope) {
  $rootScope.$on('error', (e, err) => {
    console.log(e, err);
  });
}
```

Attach the `MainCtrl` to the `<body>` in `index.html`.

```html
<body ng-controller="MainCtrl as main">
  <main ui-view></main>
</body>
```

To test that this is working, navigate to `http://localhost:7000/birds` in Chrome, and open up the Chrome console. You should see two objects being console logged. You can have a look inside the objects and you will see the following:

<img src="http://i.imgur.com/gEt63yi.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

The first object is the event and the second is the error that is being sent back from the server. Inside `statusText` we can see the "Unauthorized" message that is specified in our controller.

Inside `src/js/controllers/main.js` update the `MainCtrl`:

```js
angular
  .module('birdApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state'];
function MainCtrl($rootScope, $state) {
  const vm = this;

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.message;
    $state.go('login');
  });
}
```

To display the message, in the `index.html` add:

```
<body ng-controller="MainCtrl as main">
  <div class="message" ng-if="main.message">{{ main.message }}</div>
  <main ui-view></main>
</body>
```

To test that this is working, navigate to `http://localhost:7000/birds` in Chrome. You should be redirected to the login page, and you should see "Unauthorized" at the top.

The problem we have now is that even if we do log in, we will still see "Unauthorized" at the top, because the page isn't refreshing, so the `MainCtrl` isn't re-instantiating.

To fix this, we can add another listener on the `$rootScope`.

Inside `src/js/controllers/main.js` update the `MainCtrl`:

```js
MainCtrl.$inject = ['$rootScope', '$state'];
function MainCtrl($rootScope, $state) {
  const vm = this;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    vm.message = err.data.message;
    $state.go('login');
  });

  $rootScope.$on('$stateChangeSuccess', () => {
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });
}
```

To test this is working, navigate to `http://localhost:7000/birds`, log in, and you shouldn't see "Unauthorized" at the top anymore.

We only want to redirect to the login page if the error status is 401. Update the `$state.go('login')` line to be:

```js
if(err.status === 401) $state.go('login');
```

In order to hide and show DOM elements, depending on whether a user is logged in or not, we can attach a `isAuthenticated` property to the `MainCtrl`, which will return `true` if we are authenticated.

```js
MainCtrl.$inject = ['$rootScope', '$state', '$auth'];
function MainCtrl($rootScope, $state, $auth) {
  const vm = this;

  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    vm.message = err.data.message;
    if(err.status === 401) $state.go('login');
  });

  $rootScope.$on('$stateChangeSuccess', () => {
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });
}
```

To use this we can add a `<nav>` to our `index.html`:

```html
<body ng-controller="MainCtrl as main">
  <nav>
    <ul>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsIndex">Birds</a></li>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsNew">Add a bird</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="login">Login</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="register">Register</a></li>
    </ul>
  </nav>
  <div class="message" ng-if="main.message">{{ main.message }}</div>
  <main ui-view></main>
</body>
```

If we are logged in, we will see 'Birds' and 'Add a bird', but if we aren't logged in we can see 'Login' and 'Register'.

Lastly, add a link to your nav for logout:

```html
<li ng-if="main.isAuthenticated()"><a ng-click="main.logout()" href="#">Logout</a></li>
```

> Note: The `href="#"` attribute makes the link look like a link. You could do this with CSS instead.

And in your `src/js/controllers/main.js`:

```
function logout() {
  $auth.logout();
  $state.go('login');
}

vm.logout = logout;
```

# 💻 ✌️