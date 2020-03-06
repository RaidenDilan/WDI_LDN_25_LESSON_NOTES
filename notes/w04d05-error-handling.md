# Error Handling

## Intro (5mins)

Although not the most exciting aspect of web development, providing user's with clear error messages is an essential part of the work that we do.

We all know how frustrating it is when things go wrong with a website. Even more frustrating is when, as a user, we aren't informed as to what went wrong.

We've had a look at some basic error handling with flash messges, but what about when our server falls over, or a user enters some invalid data in a form?

## A global error catcher (15mins)

The most important errors to catch are fatal errors. A fatal error is one that will make our server crash.

Rather than letting the server crash, we can catch the fatal error, send a message to the user and keep the server up and running ready to handle more requests.

In our `server.js` file, let's write some custom middleware to handle fatal errors.

This should be the **VERY LAST** piece of middleware before our `app.listen` method.

```js
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.status);
  res.locals.err = err;
  
  return res.render(`statics/${err.status}`);
  next(err);
});
```

We are checking to see if the error has a status, and if not setting the status to 500 (Internal Server Error). We'll do the same with the error message.

We then attach the error to `res.locals` so we can display it to the user.

Finally we are sending an error page based on the status of the error.

#### A custom 500 error page

Let's create a `views/statics/500.ejs` file:

```html
<h1>500: Internal Server Error</h1>

<h2><%= err.message %></h2>

<% if(locals.err.stack) { %>
<pre>
  <%= err.stack %>
</pre>
<% } %>
```

Here we are display the error, message, and the stack trace, if we have one.

Ok, let's test it by causing an error. Navigate to `http://localhost:3000/films/123`. You should see a 500 error page, with stack trace.

This is useful to us as developers, but we wouldn't want our end users to see it, so let's hide this in production. Let's update our error handler.

```js
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  if(env === 'production') delete err.stack; // remove stack trace in production
  
  res.status(err.status);
  res.locals.err = err;
  
  return res.render(`statics/${err.status}`);
  next(err);
});
```

Great!

## Handling 404 errors (15mins)

When we tested our global error handler, we created a 404 error, but handled it as if it were a 500 error. Let's fix that now.

In `controllers/films.js`, let's create a 404 error if we can't find a sepecific film:

```js
function filmsShow(req, res) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
      }
      res.render('films/show', { film });
    });
}
```

We've created our own JavaScript error! We've created it with the message `Not found`, and given it the status `404`, then `thrown` it. Throwing an error means that JavaScript will look for an error catcher, like the one we've just created. If it can't find one, it'll print the error on the terminal and stop our server from running. Basically it will cause our software to "crash".

Let's test this now. Navigate to `http://localhost:3000/films/58b0487767aaf97a222179a1`. As things stand we have no `.catch` block in our promise chain, so the error has no way of reaching our global error catcher.

We need to add `next` to the `filmsShow` function, and pass it into our `.catch` block.

```js
function filmsShow(req, res, next) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
      }
      res.render('films/show', { film });
    })
    .catch(next);
}
```

Since there's already a 404 error page in `views/statics/404.ejs` we should noe see a nice error page.

>**Note:** you should now go ahead and update the rest of the controller functions accordingly.

We should now go through and add these errors to the EDIT and DELETE routes as well, but the code is ugly and repetitive. Let's refactor first.

### Custom responses

We're going to add this code to the `res` object, a bit like the `.render()` method, so rather than having to type it all out, we can just call `res.notFound()`. This is not only neat, but it's descriptive and easy to read.

To do this we need to write some more middleware in `server.js`:

```js
app.use((req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  }

  next();
})
```

Pimp! Let's update our controller:

```js
function filmsShow(req, res) {
  Film
    .findById(req.params.id)
    .then((film) => {
      if(!film) res.notFound();
      res.render('films/show', { film });
    });
}
```

That's real neat!

## Tidying up (15 mins)

While we're here we can tidy up our `server.js` by moving our custom middleware into modules. We will put all our custom modules into a folder called `lib/`.

Let's make that folder, and create a file called `customResponses.js`:

```sh
$ mkdir lib && touch lib/customResponses.js
```

We can move our function from the `server.js` file and place it into `customResponses.js`, name it, and export it.

```js
function customResponses(req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  }

  next();
}

module.exports = customResponses;
```

Now we can require it at the top of `server.js` and use it in place of the code that we removed:

```js
const customResponses = require('customResponses');
.
.
.
app.use(customResponses);
```

Cool. We can do the same for our error handler middleware.

>**Note:** It's probably worth doing the same for the `secureRoute` method and the custom middleware which retrieves the user's details from the session.

## Conclusion (5 mins)

Error handling is often left to the end of the development, but actually very useful to us during the development process. It's always best to set up our error handling early on in the build so that we have a clear idea of what is happening when things go wrong.

