---
title: Handling Form Errors
type: lesson
duration: "1:20"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, Server Applications
---

### Objectives
*After this lesson, students will be able to:*

- Understand Mongoose built-in validations
- Handle form errors gracefully

### Preparation
*Before this lesson, students should already be able to:*

- Build a RESTful App with Express
- Create HTML5 forms

# Handling Form Errors

## Intro (10mins)

Forms are a particularly important part of a website. They are a point of contact between a brand and its users.

If a form is poorly designed, or frustrating to use, people will stop coming to our websites. This is abviously very bad. In this session we will look at ways to validate the data that the user has input, and also provide meaningful feedback.

## Validations (10 mins)

Mongoose comes with some validations baked in that we can use right out of the box:

#### `Number`
- `min`
- `max`

#### `String`
- `enum`
- `match`
- `maxlength`
- `minlength`

#### Any data type
- `required`

The `min`, `max`, `minlength`, `maxlength` and `required` validators should be obvious, but what about `enum` and `match`?

### `enum`

`enum` is short for enumerator, and means that we can provide an array of strings. The provided value should match one of the strings in the array.

For exmaple if you wanted to take a user's gender in a form, you could ask them to type it out, but most likely you'd have people entering: `Female`, `female`, `woman`, `f`. Probably with some typos for good measure. We can enforce specific words like so:

```js
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }
});
```

Now we can ensure that the data in our database is of a unified format.

### `match`

The `match` validator ensures that the string entered passes a regular expression.

#### Regular Expressions

A regular expression is a sequence of symbols and characters expressing a string or pattern to be searched for within a string.

Here's an example of a regular expression (or regex for short):

```js
/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/
```

The first and last slash denote the beginning and end of the expression.

The square brackets indicate a group or range to search for `[0-9]` says find any number between 0 and 9.

The curly braces indicate the number of consecutive instances of the group to look for. `[0-9]{2}` says find two numbers between 0-9 next to each other.

Since `/` ends the regular expression, if we actually want to search for a `/`, we need to escape it with a `\`.

So all together `/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/` will match a string that looks like this: `00/00/0000` or `17/10/2017`.

There's lots more to regular expressions. For more info check out this article: [You Don't Know Anything About Regular Expressions: A Complete Guide](https://code.tutsplus.com/tutorials/you-dont-know-anything-about-regular-expressions-a-complete-guide--net-7869)

## Displaying errors to the user (15 mins)

Let's add some validations to our `films` model:

```js
const filmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: String, required: true, match: /[0-9]{4}-[0-9]{2}-[0-9]{2}/ },
  synopsis: { type: String, maxlength: 255 },
  genre: { type: String, required: true },
  wikipedia: { type: String },
  images: [{ type: String }]
});
```

Great. Now let's test this by trying to submit an empty form. Naviagte to `http://localhost:3000/films/new` and submit the form.

You should see an error message.

```
500: Internal Server Error
Film validation failed
```

Good, our validations are working, but that's a horrible message for a user to see. We can improve on this somewhat.

Instead of displaying our 500 error page, we're going to catch the error, reload the page and display a flash message informing the user of the failed validations.

Inside our `lib/customResponses.js` file we can add another method onto `res`:

```js
function customResponses(req, res, next) {
  .
  .
  .

  res.badRequest = function(url, errors) {
    req.flash('danger', errors);
    return res.redirect(url);
  }

  next();
}
```

So we need to provide the url of the page with the errors, and the errors (in the form of a string) to our new `badRequest` method.

Let's put it into use in our films controller:

```js
function filmsCreate(req, res, next) {
  Film
    .create(req.body)
    .then(() => res.redirect('/films'))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.badRequest('/films/new', err);
      }
      next(err);
    });
}
```

Ok, let's give it a try. Resubmit the empty form, you should see the errors appear at the top of the page.

Oh dear, it says `[object Object]`. What's happened is that since `err` is an object, and not a string, the template has done its best to turn it into a string, and we get `[object Object]`.

Luckily Mongoose errors have a handy `.toString()` method which is very useful here:

```js
function filmsCreate(req, res, next) {
  Film
    .create(req.body)
    .then(() => res.redirect('/films'))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.badRequest('/films/new', err.toString());
      }
      next(err);
    });
}
```

OK, now we should get something more readable.

```
ValidationError: Path `synopsis` is required., Path `releaseDate` is required., Path `name` is required.
```

Hmm, not terrible, the wording is not ideal, but we have some errors displayed to the user.

We can add custom error messages to Mongoose, but for now we'll leave it here for the server side.

## Frontend validation (10 mins)

We should **ALWAYS** handle validation on the server, since it is much more secure than the frontend. However, HTML5 provides frontend form validation for us, which will prevent the form from being submitted if it contains invalid data.

This is better for us, since we do not have to handle a bad request, saving us bandwidth, and it is also better for the user, since they get instant feedback.

Let's add some to the `films/new.ejs` template:

```html
<form method="POST" action="/films">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" name="name" id="name" placeholder="Name" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="releaseDate">Release Date</label>
    <input type="date" name="releaseDate" id="releaseDate" class="form-control" required pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}">
  </div>
  <div class="form-group">
    <label for="synopsis">Synopsis</label>
    <textarea name="synopsis" id="synopsis" placeholder="Synopsis" class="form-control" required maxlength="255"></textarea>
  </div>
  .
  .
  .
</form>
```

Ok, let's try our form again.

The user will now get a helpful, if slightly ugly error message, the form is never submitted and everyone is happy.

## Independent practise (30 mins)

Although our validations are doing their job, most clients would not be happy with Chrome's error messages. They probably wouldn't fit into the look and feel of the website, and look a little ugly.

Let's make them look nicer with the [jQuery Validatin Plugin](https://jqueryvalidation.org/).

It's very simple to use, and there is a great tutorial video on the homepage of the site.

Add the plugin, then style the error messages.

## Conclusion (5 mins)

While rather dry, form validation is a very important part of our jobs as web developers.

A simple to use, informative form will generally go unnoticed, but a misleading form with no error handling will make our sites look amateurish and will drive away our user base.
