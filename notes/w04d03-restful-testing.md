---
title: Testing an Express App with Mocha and Chai
type: lesson
duration: "1:30"
creator:
    name: Mike Hayden
    city: London
competencies: Testing
---

# Testing an Express App with Mocha and Chai

### Objectives
*After this lesson, students will be able to:*

- Understand the concept of a creating tests
- Be familiar with the concept of TDD
- Recognise common testing syntax & patterns of a test framework

### Preparation
*Before this lesson, students should already be able to:*

- Create an Express App
- Have an understanding of REST and REST actions

## Intro (10 mins)

When we build complex software, especially software for commercial use, it is important that we write automated tests as we go. This allows for piece of mind, not only for the developer, but also other members of the team, like the Tech Lead and Project Manager. By having suite of tests, all members of the team can see progress at a glance.

Furthermore, having good test coverage of an application makes it easier to mantain, refactor and deploy.

In this session we will be writing tests for an Express app. In the starter code you will see a basic app setup:

```
├── server.js
├── config
│   └── routes.js
├── controllers
│   └── chocolates.js
├── db
│   └── seeds.js
├── models
│   └── chocolate.js
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   ├── images
│   └── js
│       └── app.js
└── views
    └── layout.ejs
```

You can see there is a _controller_ and _model_ for a `chocolate` resource, but both those files are empty. We will be writing tests for the Model, View and Controller of the resource **before** we actually build them. This is the principle of Test Driven Development (TDD).

## The tools of the trade (5 mins)

There are many testing frameworks out there, but one of the most popular for Node apps is `mocha`. We will need to install it globally with `npm`:

```sh
$ npm i -g mocha
```

`chai` is an assertion library which can be used with any js testing framework. It allows us to create tests that read more clearly. We need to install `chai` into our project with `--save-dev`, as we will **only need to use it locally**.

```sh
$ npm i --save-dev chai
```

`supertest` allows us to send requests to our server and test the responses from the command-line. Let's install that now as well:

```sh
$ npm i --save-dev supertest
```

## Setting up our app (10 mins)

Before we start testing there's a little bit of prep work we need to do first.

### Exporting our app

We will be creating all of our tests in a `test` folder. We will need to require our app at the top of each test file, so that we can run our tests against it. To do that we will need to export our app at the bottom of the `app.js` file:

```js
.
.
.
app.listen(port, () => console.log(`Running on port: ${port}`));

module.exports = app;
```

### Setting up a test environment

When we test models, we need to save the test data to a database, but we don't want those tests to interfere with our development or production databases.

When we deploy our code to Heroku a `NODE_ENV` enironment variable is set to `production`. We can use this variable to indicate whether we are in development, production or test mode, and select the correct database accordingly.

To do that, let's create a new file `config/envoronment.js` and add the following:

```js
module.exports = {
  port: process.env.PORT || 8000,
  env: process.env.NODE_ENV || 'development',
    dbURI: process.env.MONGODB_URI || `mongodb://localhost/chocolates-${this.env}`
};
```

Now, let's use that in our `app.js` file to determine the database we will use:

```js
// remove the existing port constant
const { env, port, dbURI } = require('./config/environment');
.
.
.
mongoose.connect(dbURI);
```

Now, if we are in development mode, we will point to `chocolates-development` and in test mode, `chocolates-test`.

### Creating a test file

By default mocha will look for test scripts in a `test` directory. Let's make the folder and create a test script inside it:

```
$ mkdir test && touch test/chocolates.js
```

Now we need to setup the test script:

```js
process.env.NODE_ENV = 'test';

const should = require('chai').should();
const expect = require('chai').expect;
const app = require('supertest')(require('../server'));
const Chocolate = require('../models/chocolate');
```

Here, we're setting our `NODE_ENV` to `test`, which will in turn set our app to test mode. We require `should` and `expect` global functions from `chai`, configure `supertest` to work with our app, and finally `require` our `Chocolate` model, so we can easily work with our test database.

#### `beforeEach`

Our test database needs to contain some data, but we need to make sure that no test relies on a previous test. For this reason we will clear the database, then populate it again before each test is run. `mocha` has a `beforeEach` method for this very purpose:

```js
const testData = [{
  name: 'Topic',
  brand: 'Mars',
  image: 'https://images-na.ssl-images-amazon.com/images/I/31w29%2BTlWQL.jpg'
},{
  name: 'Mars',
  brand: 'Mars',
  image: 'https://images-na.ssl-images-amazon.com/images/I/71NrROgheSL._SX522_.jpg'
},{
  name: 'Bounty',
  brand: 'Mars',
  image: 'https://upload.wikimedia.org/wikipedia/en/1/19/Bounty-Wrapper-Small.jpg'
},{
  name: 'Lion',
  brand: 'Nestlé',
  image: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Lion-Bar-Wrapper-Small.jpg'
},{
  name: 'Crunchie',
  brand: 'Cadbury',
  image: 'http://sweets.seriouseats.com/assets_c/2013/10/20131015-crunchie-package-post-thumb-610x183-358867.jpg'
},{
  name: 'Wispa',
  brand: 'Cadbury',
  image: 'https://www.cadburygiftsdirect.co.uk/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/w/i/wispa-1200x500px.png'
}];
  
beforeEach((done) => {
  Chocolate.collection.drop();
  Chocolate.create(testData, done);
});
```

## Index route (15 mins)

First up let's test the `/chocolates` route, and make sure that when we visit that url, we see the index page, displaying some chocolatey goodness.

We'll write two tests for this: one to check that we get a `200 OK` response; and one to check that we see the names of all the chocolate bars in our database.

```js
describe('GET /chocolates', () => {

  it('should return a 200 response', (done) => {
    app.get('/chocolates')
      .expect(200, done);
  });

  it('should display all the chocolates', (done) => {
    app.get('/chocolates')
      .end((err, res) => {
        testData.forEach((record) => {
          expect(res.text).to.contain(`<h2>${record.name}</h2>`);
          expect(res.text).to.contain(`<h4>${record.brand}</h4>`);
          expect(res.text).to.contain(`src="${record.image}"`);
        });
        done();
      });
  });

});
```

Firstly we make a request to `/chocolates` and check whether the HTTP response code is `200`.

In the second test, we once again make a request to the `/chocolates` endpoint, but this time we check the HTML that is returned for the name, brand, and image for each chocolate in our test database.

Notice after each test we call the `done` callback, which lets `mocha` know that the test is finished and it can move on to the next test.

Run the tests form the terminal:

```sh
$ mocha
```

You should see the following:

```sh
Running on port: 8000
  GET /chocolates
    1) should return a 200 response
    2) should display all the chocolates


  0 passing (127ms)
  2 failing

  1) GET /chocolates should return a 200 response:
     Error: expected 200 "OK", got 404 "Not Found"
      at Test._assertStatus (node_modules/supertest/lib/test.js:266:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:281:11)
      at Test.assert (node_modules/supertest/lib/test.js:171:18)
      at Server.assert (node_modules/supertest/lib/test.js:131:12)
      at emitCloseNT (net.js:1553:8)
      at _combinedTickCallback (internal/process/next_tick.js:71:11)
      at process._tickCallback (internal/process/next_tick.js:98:9)

  2) GET /chocolates should display all the chocolates:
     Uncaught AssertionError: expected '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>mocha-chai</title>\n  </head>\n  <body>\n    <main>\n      <h1>404: Not Found</h1>\n<pre></pre>\n    </main>\n  </body>\n</html>\n' to include '<h2>Topic</h2>'
      at Test.app.get.end (test/chocolate.js:47:29)
      at Test.assert (node_modules/supertest/lib/test.js:179:6)
      at Server.assert (node_modules/supertest/lib/test.js:131:12)
      at emitCloseNT (net.js:1553:8)
      at _combinedTickCallback (internal/process/next_tick.js:71:11)
      at process._tickCallback (internal/process/next_tick.js:98:9)
```

Great, our tests fail! That means that they are working! You can see that instead of receiving a `200 OK` response we get a `404 Not Found`. Also, we don't see the chocolates displaying on the screen, we get a 404 error page instead.

## Independent practise

Write just enough code to make these tests pass. There's quite a lot to do here, you'll need to build out the model, view and controller for the index route.

**Remember:** you should only write _JUST ENOUGH_ code to make the test pass. There is no point adding anything to the controller or routes file that is not needed to make this test pass.

## New route

The new route is simpler than the index route, because it is not dynamic. However, we do need to check for a form, and that the form has the correct method and action on it:

![screen shot 2017-02-22 at 14 26 45](https://cloud.githubusercontent.com/assets/3531085/23215718/4882d644-f90b-11e6-9a60-68161bfe77ea.png)

## Create route

After we submit the create form, we should redirect to the index route. So firstly we need to check that we are being redirected. To do this we need to check for a `302` response. We can also check for the `location` header to be `/chocolates`, indicating the path we are being redirected to.

We can also test that the data was actally saved by reloading the index route after submitting the form, to check that the new record is present:

![screen shot 2017-02-22 at 14 27 00](https://cloud.githubusercontent.com/assets/3531085/23215719/4898587a-f90b-11e6-9ebc-d8ad6fb14af8.png)

## Show route

### `beforeEach`

In order to test the show route, we need an `id` to use in the path `/chocolates/:id`, so we can ise the `beforeEach` method here as well:

![screen shot 2017-02-22 at 14 27 17](https://cloud.githubusercontent.com/assets/3531085/23215720/489c9264-f90b-11e6-97fb-6213796339f0.png)

Here we create a variable `record` that will store a chocolate from the database before each test. We can then use that to retrieve that specific chocolate's id and make the request.

We will also test for the presence of a link to the edit page, and a delete form:

![screen shot 2017-02-22 at 14 27 45](https://cloud.githubusercontent.com/assets/3531085/23215722/48a60d6c-f90b-11e6-923f-1708f9547fc9.png)

## Edit route

The edit route is similar to the new route, except that the form should be pre-populated, and should point to the correct endpoint with the correct method:

![screen shot 2017-02-22 at 14 27 58](https://cloud.githubusercontent.com/assets/3531085/23215721/489e01da-f90b-11e6-8e9f-8402703474b7.png)

So we are checking that `method-override` has been implemented, that the `method` and `action` of the form is correct, and that the `input` tags have the correct `value` attributes set.

## Update & delete

Ok, it's over to you. Using the test we've writen before for guidance, and following the instructions below, finish the test suit by writing tests for the last two RESTful routes.

#### Update

Similar to the create route we need to do the following: 

- send form data to the correct `RESTful` route
- check for the correct response for a `redirect`
- check that the correct path is send in the redirect response.
- check that the changes have been persisted by reqesting the SHOW route for the updated resource.

#### Delete route

- make a `DELETE` request to the correct `RESTful` route
- check for a redirect response to the correct path
- this time, make sure that the deleted resource is **not** on the `INDEX` page.

## Conclusion

Writing tests is a skill in itself. It's important to understand **what** you need to test and also **how** you go about doing so.

These tests are by no means exhaustive nor are they necessarily the best way to test a web application. Each project you build will require it's own specific set of tests, but hopefully this lesson has exposed you to the syntax and approach to testing complex software.





