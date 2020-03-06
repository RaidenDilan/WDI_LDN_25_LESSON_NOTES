![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

## Express App Setup - Walkthrough

**This is a step-by-step guide to setting up an Express App.**

In your terminal create a folder and name your app.

```bash
mkdir express-app
cd express-app
```

Create your `server.js` file and a `package.json` file:

```
touch server.js
npm init
```

The `package.json` file keeps a record of all the packages that the project relies on. This means that we can easily share our project. Hit enter to all questions.

Open up the new project in Atom.

#### Installing packages

Install the other packages that we need using `npm i --save`:

* **[express](https://github.com/expressjs/express)** (the framework)
* **[ejs](https://github.com/mde/ejs)** (templating engine)
* **[express-ejs-layouts](https://github.com/Soarez/express-ejs-layouts)** (allows us to use partials and a parent template)
* **[morgan](https://github.com/expressjs/morgan)** (logging)
* **[mongoose](https://github.com/Automattic/mongoose)** (to connect to the mongo database)
* **[express-session](https://github.com/expressjs/session)** (logging in and out)
* **[express-flash](https://github.com/RGBboy/express-flash)** (flash messages)
* **[method-override](https://github.com/expressjs/method-override)** (to use PUT and DELETE requests)
* **[body-parser](https://github.com/expressjs/body-parser)** (handles our form data) 
* **[bluebird](https://github.com/petkaantonov/bluebird)** (promises)
* **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** (password hashing)

Once we've installed these, we need to require our packages inside `server.js`.

```js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
```

<br>

#### Setting up views & static files

We need to create an express app. Underneath, add:

```js
const app = express();
```

Next let's set up our views:

```js
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);
```

And define where we are going to store our static assets:

```js
app.use(express.static(`${__dirname}/public`));
```

<br>

#### Connecting to the database

Let's hook up our database. We need to specify the name of the database we want to connect to. Let's store this inside a configuration file, that will hold the following: `dbURI`, `port`, `env` and `sessionSecrect`.

In the terminal:

```bash
mkdir config
touch config/environment.js
```

Inside `config/environment.js` add:

```js
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/PROJECT_NAME-${env}`;
const sessionSecret = process.env.SESSION_SECRET || 'my awesome secret';

module.exports = { port, env, dbURI, sessionSecret };
```

Let's require this file at the top of our server.js file. Underneath where we've required `body-parser` add:

```js
const { port, env, dbURI, sessionSecret } = require('./config/environment');
```

Now let's connect to our database. Underneath where we've set up the views add:

```js
mongoose.connect(dbURI);
```

In order to test that what we've written so far is OK, let's connect to a port, and run `nodemon`. At the bottom of the file add:

```js
app.listen(port, () => console.log(`Express is listening to port ${port}`));
```

Your `server.js` file should now look like this:

```js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret } = require('./config/environment');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

app.use(express.static(`${__dirname}/public`));

mongoose.connect(dbURI);

app.listen(port, () => console.log(`Express is listening to port ${port}`));
```

<br>

#### Setting up middleware

Underneath where we've connected to the database, let's set up our middleware.

```js
if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
```

Here we are saying, only use the morgan logging middleware if the environment is not 'test'. Then we are setting up `body-parser`, and finally `method-override`.

<br>

#### Sessions & flash messages

Underneath where we've added the `method-override` middleware, add:

```js
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
```

The `server.js` file should now look like this:

```js
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret } = require('./config/environment');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

app.use(express.static(`${__dirname}/public`));

mongoose.connect(dbURI);

if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.listen(port, () => console.log(`Express is listening to port ${port}`));
```

<br>

#### Authentication & error handling 

Let's create a `lib` directory, and some files to hold our custom error handlers and responses. In the terminal:

```bash
mkdir lib
touch lib/authentication.js lib/errorHandler.js lib/customResponses.js lib/secureRoute.js
```

Inside `errorHandler.js` add:

```js
const { env } = require('../config/environment');

function errorHandler(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  
  if(env === 'production') delete err.stack;

  res.status(err.status);
  res.locals.err = err;

  res.render(`statics/${err.status}`);
  next(err);
}

module.exports = errorHandler;
```

Here we are deciding which error page to render, and attaching the error to the repsponse object, so that we can send it to the view.

Now back in the `server.js` file, let's require it at the top of the page.

```
const errorHandler = require('./lib/errorHandler');
```

And at the bottom of the page, we can use it. This should be the last thing before `app.listen()`.

```js
app.use(errorHandler);
```

Inside `secureRoute.js` add:

```js
function secureRoute(req, res, next) {
  if(!req.session.isAuthenticated || !req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('alert', 'You must be logged in');
      return res.redirect('/login');
    });
  }

  next();
}

module.exports = secureRoute;
```

<br>

#### Routes

We will be using our `secureRoute` function inside our `routes.js` file, so let's create one.

```bash
touch config/routes.js
```

And inside add the following:

```js
const router = require('express').Router();
const secureRoute = require('../lib/secureRoute');

module.exports = router;
```

Let's require our router inside `server.js`. At the top add:

```
const routes = require('./config/routes');
```

Let's use the routes. It's important that we place this line of code after we've set up flash messages, but before our error handler.

```
app.use(routes);
```

Your `server.js` file should now look like this:

```
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret } = require('./config/environment');
const errorHandler = require('./lib/errorHandler');
const routes = require('./config/routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

app.use(express.static(`${__dirname}/public`));

mongoose.connect(dbURI);

if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(routes);

app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening to port ${port}`));
```

Inside your `routes.js` file, underneath where you've required the `secureRoute` function, add:

```js
router.all('*', (req, res) => res.notFound());
```

Let's write the `notFound` function inside `customResponse.js`:

```js
function customResponses(req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  };

  next();
}

module.exports = customResponses;
```

Require this file at the top of `server.js`:

```js
const customResponses = require('./lib/customResponses');
```

Underneath where we've set up the flash messages add:

```js
app.use(customResponses);
```

<br>

#### Authentication

Inside `authentication.js` add:

```js
const User = require('../models/user');

function authentication(req, res, next) {
  if(!req.session.isAuthenticated) return next();

  User
    .findById(req.session.userId)
    .then((user) => {
      if(!user) {
        return req.session.regenerate(() => {
          req.flash('alert', 'You must be logged in');
          return res.redirect('/login');
        });
      }

      req.session.userId = user.id;
      
      req.user = user;

      res.locals.user = user;
      res.locals.isAuthenticated = true;

      next();
    })
    .catch(next);
}

module.exports = authentication;
```
At the top of the `server.js` file add:

```js
const authentication = require('./lib/authentication');
```

And underneath where we've set up our `customResponses` add:

```js
app.use(authentication);
```

<br>

#### User model

Let's create a User model. In the terminal:

```bash
mkdir models
touch models/user.js
```

Inside `models/user.js` add:

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String, required: true }
});

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.pre('validate', function checkPassword(next) {
  if(!this._passwordConfirmation || this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

<br>

#### Views

In the terminal:

```
mkdir views
touch views/layout.ejs
mkdir views/sessions views/registrations views/statics
touch views/sessions/new.ejs
touch views/registrations/new.ejs
touch views/statics/500.ejs
touch views/statics/404.ejs
touch views/statics/index.ejs
```

In `layout.ejs` add:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>PROJECT_NAME</title>
  </head>
  <body>
    <% for(const type in messages) { %>
      <div class="<%= type %>">
        <h5><%= messages[type] %></h5>
      </div>
    <% } %>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

In `statics/index.ejs` add:

```html
<h1>PROJECT_NAME</h1>
```

In `statics/500.ejs` add:

```html
<h1>500: Internal Server Error</h1>

<h2><%= err.message %></h2>

<% if(locals.err.stack) { %>
<pre>
  <%= err.stack %>
</pre>
<% } %>
```

In `statics/404` add:

```html
<h1>404: Not Found</h1>
```

In `sessions/new.ejs` add:

```html
<h1>Login</h1>

<form method="POST" action="/login">
  <div>
    <label for="email">Email</label>
    <input type="text" name="email" id="email" required>
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" required>
  </div>

  <button class="button">Login</button>
</form>
```

And in `registrations/new.ejs` add:

```html
<h1>Register</h1>


<form method="POST" action="/register">
  <div>
    <label for="username">Username</label>
    <input type="text" name="username" id="username">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" id="password">
  </div>
  <div>
    <label for="passwordConfirmation">Password Confirmation</label>
    <input type="password" name="passwordConfirmation" id="passwordConfirmation">
  </div>

  <button>Register</button>
</form>
```

<br>

#### Controllers

In the terminal:

```bash
mkdir controllers
touch controllers/registrations.js
touch controllers/sessions.js
```

Inside `controllers/registrations.js` add:

```js
const User = require('../models/user');

function newRoute(req, res) {
  return res.render('registrations/new');
}

function createRoute(req, res, next) {
  User
    .create(req.body)
    .then(() => res.redirect('/login'))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        req.flash('alert', 'Passwords do not match');
        return res.redirect('/register');
      }
      next();
    });
}

module.exports = {
  new: newRoute,
  create: createRoute
};
```

Inside `controllers/sessions.js`:

```js
const User = require('../models/user');

function sessionsNew(req, res) {
  res.render('sessions/new');
}

function sessionsCreate(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) {
        req.flash('danger', 'Unknown email/password combination');
        return res.redirect('/login');
      }

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      req.user = user;

      req.flash('success', `Welcome back, ${user.username}!`);
      res.redirect('/');
    })
    .catch(next);
}

function sessionsDelete(req, res) {
  req.session.regenerate(() => res.redirect('/'));
}

module.exports = {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete
};
```

Finally, in our `routes.js` file, update it to include the following:

```js
const router = require('express').Router();
const secureRoute = require('../lib/secureRoute');
const sessions = require('../controllers/sessions');
const registrations = require('../controllers/registrations');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.all('*', (req, res) => res.notFound());

module.exports = router;
```

<br>

#### Check it's working!

Run `nodemon` and navigate to `localhost:3000`. Check your register and login are working. 