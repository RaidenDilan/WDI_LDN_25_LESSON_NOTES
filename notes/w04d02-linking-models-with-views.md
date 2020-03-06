---
title: Linking Models to Views
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Server Applications
---

# Linking Models to Views

## Overview

So far we have looked at how to interact with our Mongo database through the command line, and by adding data via a `.js` file with the Mongoose ORM. In order to view the data we used `console.log` to see it displayed in the terminal. However, what we really want to do is to be able to render this data in the views of our application. In this lesson we will look at how we can incorporate Mongoose with what we have already learnt about Express route handlers.

## Set up

Open up the `starter-code`. Your folder structure should look like this:

```bash
.
├── db
│   └── seeds.js
├── models
│   ├── computer.js
│   └── trainer.js
├── package.json
├── public
│   ├── css
│   └── js
├── server.js
└── views
    ├── 404.ejs
    └── index.ejs
```

Install the node modules by running `npm i` in the terminal.

Open up the `starter-code` in Atom, and have a look at the `db/seeds.js` file. You should recognise this structure from the lesson on how to write a seeds file. Open up the `models` directory and have a look at the models inside. These are also the same as before.

From the root of the directory, run `nodemon` in the terminal, and navigate to `http://localhost:3000`. You should see the homepage, with the words "Welcome to Shoppr!". We won't be adding anything else to the homepage. 

Click on the links in the navbar. Notice that in the url we are being taken to `/trainers` or `/computers`, but we are seeing the "404 Not Found" page. Why is this?

The reason we're being taken to this page is that at the moment we don't have any routes set up to handle these requests. Open up the `server.js` file and take a look at the routes that we do have.

```js
app.get('/', (req, res) => {
  res.render('index');
});

app.get('*', (req, res) => {
  res.render('404');
});
```
We have one route that handles a request for the homepage (`/`), and one that handles everything else, which renders the 404 page. We need to add two new routes, one that handles a `GET` request to `/computers` and one that handles a `GET` request to `/trainers`.

### Creating new views

We also need to create two new templates, one for each route, as these two pages will have slightly different layouts. Let's create these first.

In the terminal type the following commands:

```bash
touch views/computers.ejs
touch views/trainers.ejs
```

Copy and paste the entire content of the `index.js` file into both of these new files, and update the `<h1>` tag on each page to be either "Trainers" or "Computers". Our new templates are now ready to be rendered. 

### Adding new routes

Inside the `server.js` file, underneath the route for the homepage, add two new routes, that will handle the requests for `/trainers` and `/computers`.

```js
app.get('/trainers', (req, res) => {
  res.render('trainers');
});

app.get('/computers', (req, res) => {
  res.render('computers');
});
```

Test that these are working by refreshing your app in Chrome, and clicking on the links in the navbar. If we have been successful, we should see either "Trainers" or "Computers" appearing at the top of the page.

### Connecting to the Database

This is a good start. Now, let's update our route handlers so that we can pass in the data from our database. First of all, we need to make a connection to our database.

Underneath `const express = require('express');` add:

```
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
```

Next, underneath where you have set the path to your static files, add:

```
const databaseURI = 'mongodb://localhost/seeding-data';
mongoose.connect(databaseURI);
```

We are connecting to the same database that we used during the previous lesson, so the data that we seeded about the trainers and computers will still be there.

Next we need to require our models. Underneath `mongoose.connect`, add the following:

```js
const Trainer = require('./models/trainer');
const Computer = require('./models/computer');
```

Update your `/trainer` route to be:

```js
app.get('/trainers', (req, res) => {
  Trainer
    .find()
    .exec()
    .then((records) => {
      res.render('trainers', { records });
    });
});
```

And update your `/computers` route to be:

```js
app.get('/computers', (req, res) => {
  Computer
    .find()
    .exec()
    .then((records) => {
      res.render('computers', { records });
    });
});
```

Let's have a look at what is going on here. When the client makes a `GET` request to `/trainers`, we are making a query to our database, to find all instances of the Trainer model, as we haven't passed in any parameters into the `find()`.

When we are using queries with promises, we should be using `.exec()`. We don't have to for **C**reate, **U**pdate or **D**elete, but when we are making queries (**R**ead), what is returned is not a promise, so we need to use `.exec()` to explicitly call the next block.

We then use `.then()`, to render the `trainers.ejs` file, once the query to the database has finished. At the same time we can pass the found data to the view. We need to use a promise here to ensure that the query is complete, before we try and send the data to our template so that we don't get an error. 

At the moment, if we refresh the page, we won't see any difference. This is because we haven't updated the `.ejs` files to display the data that we are now passing them. 

### Updating the Views

Inside `trainers.ejs`, underneath the heading, add:

```ejs
<h1>Trainers</h1>
<%= records %>
```

Now refresh the page. You should see that we are now getting back the data from the database, but it is very hard to read. All we need to do now it to decide how we want to structure our HTML, and use EJS tags to pull out the right bits of data at the right time.

Our data is made up of multiple objects, so let's loop through the objects and print their properties. The syntax for this in EJS is a little bit fiddly. We could do either a for loop or a forEach loop. Let's do a forEach as it is slightly easier to read:

```html
<div class="row">
  <% records.forEach((record) => { %>
    <div class="col-md-6">
      <img class="img-fluid" src="<%= record.image %>" alt="<%= record.model %>">
      <h4><%= record.model %></h4>
      <h6><%= record.brand %></h6>
      <p>
        Available In:
        <ul class="list-group">
          <% record.colors.forEach((color) => { %>
            <li class="list-group-item"><%= color %></li>
          <% }) %>
        </ul>
      </p>
      <p>&pound;<%= record.rrp %></p>
    </div>
  <% }) %>
</div>
```

Refresh the page in Chrome. Awesome! Thanks to the Bootstrap classes, we now have something that looks pretty good, without doing any CSS ourselves. There is definitely an opportunity to make this look slick, but right now, let's focus on Node/Express.

Let's do something similar for the computers. Inside `computers.ejs`, add the following:

```html
<div class="row">
  <% records.forEach((record) => { %>
    <div class="col-md-6">
      <img class="img-fluid" src="<%= record.image %>" alt="<%= record.model %>">
      <h4><%= record.model %></h4>
      <h6><%= record.brand %></h6>
      <p>
        Specs:
        <table class="table table-striped">
          <tbody>
            <tr>
              <td>Ram</td>
              <td><%= record.ram %> GB</td>
            </tr>
            <tr>
              <td>Processor</td>
              <td><%= record.processor %></td>
            </tr>
            <tr>
              <td>Capacity</td>
              <td><%= record.capacity %> GB</td>
            </tr>
          </tbody>
        </table>
      </p>
      <p>&pound;<%= record.rrp %></p>
    </div>
  <% }) %>
</div>
```

Now refresh in Chrome and check it out. We only have one computer in our database, but if we added more, we would see new entries appearing along side the MacBook Air.

## Conclusion

We have covered quite a few new concepts here, but they are fundamental in full stack web development. It is important to understand how we make queries to the database depending on the type of request made to the server, how we send that data to the views, and then how we iterate over the data to display it to the user. This is the foundation that we are going to build on as we develop full stack apps.
