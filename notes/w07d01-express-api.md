---
title: Express API
type: lesson
duration: "1:20"
creator:
    name: Mike Hayden
    city: London
competencies: Server Applications
---

# Express API

### Objectives
*After this lesson, students will be able to:*

- Make an API with Express
- Test the API using Postman or Insomnia
- Understand the difference between an API and a web application

### Preparation
*Before this lesson, students should already be able to:*

- Must understand what JSON is
- Should be able to make an MVC Express app 

## Intro (10 mins)

In this session we are going to look at how we create an API using Express.

A lot of the stuff we've learned about Express is relevant here. In fact, the only major difference between an Express App and an Express API is the view layer.

You might think that an API is not really MVC, because it doesn't have a view layer. APIs generally render either XML or JSON, instead of HTML. This output could be considered the view layer, even though there are no templates.

An API is also not technically RESTful, since two of the seven RESTful routes are no longer required: `NEW` and `SHOW`. Again, APIs that adhere to the remaining 5 RESTful routes are often considered REST APIs.

With this in mind, let's create an API with Express, so we can see the similarities and differences.

## `server.js` (10 mins)

Let's create a new folder `express-api` and inside create a `server.js` file. We can also `npm init` while we're at it:

```sh
$ mkdir express-api && cd express-api
$ touch server.js && npm init
```

Once `npm init` has done it's job, let's install the packages we'll need.

We'll basically be using everything that we've used before, except we don't need `method-override`, since we can send `PUT`, `PATCH` and `DELETE` requests directly with AJAX.

We also don't need `ejs` or `express-ejs-layouts` since we don't require a templating engine.

We won't need `express-session` or `express-flash` either, since APIs are not designed to work exclusively with browsers, so do not create cookies.

We'll not be setting up any authentication for our first API, so we can omit `bcrypt` as well.

Ok, let's install what we do need:

```sh
$ npm i --save express morgan mongoose bluebird body-parser
```

And that's it!

Let's include them in our `server.js` file:

```js
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
```

## `config/environment.js` (5 mins)

Let's set up our environment as before:

```js
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/express-api-${env}`;

module.exports = { port, env, dbURI };
```

And then require it in our `server.js` file:

```js
const { port, env, dbURI } = require('./config/environment');
```

Then connect to our database:

```js
mongoose.connect(dbURI);
```

And create our express app instance:

```js
const app = express();
```

## `body-parser` (5 mins)

We also need to set up `body-parser`, but this time we'll be handling JSON and not form data, so we need to configure it slightly differently:

```js
app.use(bodyParser.json());
```

Much nicer!

## Model, Controller and Router (15 mins)

We're going to be making the GA Doughnuts API which we used in the last module. We'll start with the model:

```js
const mongoose = require('mongoose');

const donutSchema = new mongoose.Schema({
  style: String,
  flavor: String
});

module.exports = mongoose.model('Donut', donutSchema);
```

Now we can flesh out our controller. It'll be a little simpler than before, since we only have the 5 routes:

```js
const Donut = require('../models/donut');

function indexRoute(req, res, next) {
  Donut
    .find()
    .then((donuts) => res.json(donuts))
    .catch(next);
}

function createRoute(req, res, next) {
  Donut
    .create(req.body)
    .then((donut) => res.status(201).json(donut))
    .catch(next);
}

function showRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();
      res.json(donut);
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();

      for(const field in req.body) {
        donut[field] = req.body[field];
      }

      return donut.save();
    })
    .then((donut) => res.json(donut))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Donut
    .findById(req.params.id)
    .then((donut) => {
      if(!donut) return res.notFound();
      return donut.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute
};
```

As you can see, Express makes things nice an easy for us with it's inbuilt `res.json` method.

Now for the router:

```js
const router = require('express').Router();
const donutsController = require('../controllers/donuts');

router.route('/donuts')
  .get(donutsController.index)
  .post(donutsController.create);

router.route('/donuts/:id')
  .get(donutsController.show)
  .put(donutsController.update)
  .delete(donutsController.delete);

// catch all 404 response
router.all('*', (req, res) => res.notFound());

module.exports = router;
```

## `customResponses` and `errorHandler` (10 mins)

Since we're not using views, and since `res.redirect` will no longer work for us, we need to update our `customResponses` and `errorHandler` middleware:

```js
// lib/customResponses.js
function customResponses(req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  }

  res.badRequest = function badRequest(errors) {
    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = errors;
    
    throw err;
  }
  
  res.unauthorized = function unauthorized() {
    const err = new Error('Unauthorized');
    err.status = 401;
    
    throw err;
  }

  next();
}

module.exports = customResponses;
```

Now let's update our global error handler:

```js
// lib/errorHandler.js
function errorHandler(err, req, res, next) {
  if(err.name === 'ValidationError') {
    err.message = 'Bad Request';
    err.status = 400;
    err.errors = err.toString();
  }

  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';

  res.status(err.status);
  res.json({ message: err.message, errors: err.errors });
  next(err);
}

module.exports = errorHandler;
```

We can now include `customResponses`, `errorHandler` and our `routes` into our `server.js` file:

```js
app.use(customResponses);
app.use(routes);
app.use(errorHandler);
```

## `app.listen` (5 mins)

Finally we need to listen out for incoming traffic:

```js
app.listen(port, () => console.log(`Express is listening on port ${port}`));
```

## Independent practise (20 mins)

Go ahead and create a seeds file to populate the database. Once you've run it, use insomnia to test all of the CRUD actions for your API.

## Tidying up (5 mins)

You may have noticed a few things about the JSON that Express is sending. Firstly there is an `_id` property which would be more easy to manage if it lost its underscore. Also, there is a `__v` property which is important for Mongoose  to do its job effectively, but not for consumption.

Let's finish off by modifying the JSON output in our donut model:

#### Virtuals

```js
donutSchema.set('toJSON', { virtuals: true });
```

Firstly Mongoose has a virtual property `id`, which is a string representation of the ObjectId stored as `_id` in the database. by turning on virtuals, it will be included in our JSON output.

Now we have `_id`, `id` and `__v`. Let's remove the stuff we don't want.

#### Transform

```js
donutSchema.set('toJSON', {
  virtuals: true,
  transform(obj, json) {
    delete json._id;
    delete json.__v;
    return json;
  }
});
```

The `transform` method allows us to modify the JSON before we send it to the client. The method provides us with two arguments `obj` which is the raw object stored in the database, and `json` which is the default JSON representation of that object. Here we have deleted the properties that we don't want to send to the client.

#### Making it global

We can now move this `toJSON` method to be attached to all our schemas by obing it into a new file in `lib`. We'll call it `globalToJSON.js`:

```js
function globalToJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform(obj, json) {
      delete json._id;
      delete json.__v;
      return json;
    }
  });
}

module.exports = globalToJSON;
```

Now we can add it at the top of our `server.js`:

```js
mongoose.plugin(require('./lib/globalToJSON'));
```

## Conclusion

Creating an API with Express is much simpler that a full App with view layer. That makes sense actually, since the job of rendering the data to a webpage is now no longer the responibility of the server.

Later on we'll be setting up a `public` folder which will serve a basic `index.html`, `css` and client `js` files. However, rather than using `jQuery` to make requests to our API, we'll be using a much more powerful MVC framework called Angular. 