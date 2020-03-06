---
title: What is an API?
type: lesson
duration: "1:30"
creator:
    name: Mike Hayden
    city: London
competencies: NoSQL Databases, Server Applications
---

# Express Embedded and Referenced Records

### Objectives
*After this lesson, students will be able to:*

- Understand the `.populate()` method
- Understand how to perform CRUD actions on embedded data

### Preparation
*Before this lesson, students should already be able to:*

- Build a RESTful API
- Understand the difference between embedded and referenced data in NoSQL databases


## Intro (10 mins)

In this session we're going to build out a slightly more complex app, which has both embedded and referenced models.

Our app will be a crowd sourced hotel feedback site, where users can log in and create hotel listings, which users can then comment on.

### The starter code

Open up the starter code, you will see a lot of the grunt work has been done for you.

We have an Express app with authentication and forms for creating and editing a hotel listing.

### The approach

Firstly we are going to add a reference to the hotel model. The idea is that each hotel listing will have a reference to the user that created it. Only the user that created the listing will be able to edit or delete it.

The user that created each listing will be displayed on the INDEX and SHOW pages.

Secondly we will add an embedded comments schema to the hotel model. The comments schema will contain the user's comments, and a reference to the user that created the comments.

The comments for each listing will appear on the SHOW page, and will include the username of the user who made each comment.

The form for the comments will be displayed on the SHOW page, but only for authenticated users.

## Adding the user reference (10 mins)

In the hotel model, let's create a `createdBy` property, and set it to be a user id:

```js
const hotelSchema = new mongoose.Schema({
  .
  .
  .
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});
```

Here we are setting the type to be an `ObjectId`. All ids in mongoose are of the type `ObjectId`, so we need to set them using the `mongooose.Schema.ObjectId` class. The `ref` indicates which model the id refers to.

When a user creates a listing, we don't want them to have to add their own user id to the form. The user will already be logged in at this point, so we can use the logged in user's data that we've already accessed on the server-side to add to the hotel model when the record is created.

In `lib/authentication.js` let's add the whole user model to the `req` object:

```js
req.user = user;
```

Now we can add the user to the hotel in `controllers/hotel.js` in the `createRoute` function:

```js
function createRoute(req, res, next) {

  req.body.createdBy = req.user;

  Hotel
    .create(req.body)
    .then(() => res.redirect('/hotels'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/hotels/${req.params.id}/edit`, err.toString());
      next(err);
    });
}
```

Before we create the hotel, we can add the logged in user's details to the req.body, as if it were posted with the form data.

Let's test it out by creating a new listing.

Brill!

## Displaying the user (15 mins)

Currently the `createdBy` property of the model is simply the user's id. If we were to print it out on the view it would just be a long string of numbers and letters.

To get the full user object we can use the `.populate()` method in out controller. First find the hotel, then populate the `createdBy` property.

```js
function indexRoute(req, res, next) {
  Hotel
    .find()
    .populate('createdBy')
    .exec()
    .then((hotels) => res.render('hotels/index', { hotels }))
    .catch(next);
}

.
.
.

function showRoute(req, res, next) {
  Hotel
    .findById(req.params.id)
    .populate('createdBy')
    .exec()
    .then((hotel) => {
      if(!hotel) return res.notFound();
      return res.render('hotels/show', { hotel });
    })
    .catch(next);
}
```

Remeber to do it anywhere you want to display the user name.

Now inside `views/index.ejs` and `views/show.ejs` we can display the user that created the record like so:

```html
<%= hotel.createdBy.username %>
```

Nice!

## Edit and delete buttons (10 mins)

We want to add edit and delete buttons on our show page, but they should only be visible to the user that creatd the hotel in question.

Let's create a helper method in `models/hotel.js`:

```js
hotelSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};
```

We can use it in our views like so:

```html
<% if(locals.isAuthenticated && hotel.ownedBy(user)) { %>
  <a href="/hotels/<%= hotel.id %>/edit">Edit</a>
  <form method="POST" action="/hotels/<%= hotel.id %>">
    <input type="hidden" name="_method" value="DELETE">
    <button>Delete</button>
  </form>
<% } %>
```

Important to note, this will only work if we have populated our `createdBy` property. In order to make this function work regardless we can refactor it like so:

```js
hotelSchema.methods.belongsTo = function belongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};
```

If `this.createdBy` has not been populated, it will be an `ObjectId` which is infact a function!??. In order to turn it into a string, we can use the `.toString()` method.

## Adding comments (5 mins)

We need to create a comment schema to embed in our hotel model. We don't need to create a new model for this, we can create the schema inside our `hotel` model:

```js
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const hotelSchema = new mongoose.Schema({
  .
  .
  .
  comments: [ commentSchema ]
});
```

Because each hotel can have **many** comments, we need to embed the `commentSchema` inside an array.

## Comments controller functions (10 mins)

#### CREATE

Again, since we don't have a separate resource for our comments, we don't need to have a separate comments controller. We can add the functionality for adding our comments to our hotels controller:

```js
function createCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Hotel
    .findById(req.params.id)
    .exec()
    .then((hotel) => {
      if(!hotel) return res.notFound();

      hotel.comments.push(req.body); // create an embedded record
      return hotel.save();
    })
    .then((hotel) => res.redirect(`/hotels/${hotel.id}`))
    .catch(next);
}
```

The most important line above is this one:

```js
hotel.comments.push(req.body);
```

Since the comments property of the hotel model is an array, we can simply `push` the data from the form into it. Mongoose will understand this and create a new embedded record inside the `comments` property of the record.

Once we've done that, we need to save the `hotel` record, since we have no separate record for the comment that's been created.

```js
return hotel.save();
```

Again, notice we're attaching the logged in user to `req.body` before we add the comment to the hotel.

```js
req.body.createdBy = req.user;
```

#### DELETE

Our delete function is similar, however rather than using `.push` to create a comment, we need to use `.id` to **find** an embedded record by it's id, and `.remove` to then remove it from the parent record.

Let's add our functionality to the hotels controller:

```js
function deleteCommentRoute(req, res, next) {
  Hotel
    .findById(req.params.id)
    .exec()
    .then((hotel) => {
      if(!hotel) return res.notFound();
      // get the embedded record by it's id
      const comment = hotel.comments.id(req.params.commentId);
      comment.remove();

      return hotel.save();
    })
    .then((hotel) => res.redirect(`/hotels/${hotel.id}`))
    .catch(next);
}
```

Notice that we're using `req.params.commentId` here to find the specific comment in the comments array. More on that in a moment.

We need to export the new functions at the bottom of the file:

```
module.exports = {
  .
  .
  .
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
```

Add add routes for both in `config/routes.js`:

```js
router.route('/hotels/:id/comments')
  .post(secureRoute, hotels.createComment);

router.route('/hotels/:id/comments/:commentId')
  .delete(secureRoute, hotels.deleteComment);
```

Notice that `:commentId` part of the delete path? That's going to contain the id of the comment we want to delete in `req.params.commentId`.

## Adding create and delete forms (10 mins)

In the SHOW route we want to add a comments form if the user is logged in:

```html
<% if(locals.isAuthenticated) { %>
  <section>
    <h4>Leave a comment</h4>
    <form method="POST" action="/hotels/<%= hotel.id %>/comments">
      <textarea name="content" id="content" placeholder="Comment"></textarea>
      <button class="button">Leave a comment</button>
    </form>
  </section>
<% } %>
```

We're making a `POST` request to `/hotels/:id/comments` to ensure that we are attempting to create a comment, and not a hotel.

For the delete button we need to create a form **inside** the loop which displays all the comments on the SHOW page:

```html
<section>
  <h4>Comments</h4>
  <% hotel.comments.forEach((comment) => { %>
    <p><%= comment.content %></p>
    <small><%= comment.createdBy.username %></small>

    <% if(locals.isAuthenticated) { %>
      <form method="POST" action="/hotels/<%= hotel.id %>/comments/<%= comment.id %>">
        <input type="hidden" name="_method" value="DELETE">
        <button>Delete</button>
      </form>
    <% } %>
  <% }) %>
</section>
```

Notice here we are attempting to display the username of the user that made the comment. We'll need to populate that in the `showRoute` of our hotels controllers:

```js
function showRoute(req, res, next) {
  Hotel
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((hotel) => {
      if(!hotel) return res.notFound();
      return res.render('hotels/show', { hotel });
    })
    .catch(next);
}
```

All good.

Last part: we need to only allow the user who created the comment to delete their comment. We can create a similar `ownedBy` method for the comment:

```js
commentSchema.methods.belongsTo = function belongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};
```

Oh dear! We now have two functions named `ownedBy`. Not great, let's refactor:

```js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ ... });

commentSchema.methods.belongsTo = function commentBelongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};

const hotelSchema = new mongoose.Schema({ ... });

hotelSchema.methods.belongsTo = function hotelBelongsTo(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return user.id === this.createdBy.toString();
};
```

Great! Let's update the SHOW route to use this new method:

```html
<% if(locals.isAuthenticated && comment.ownedBy(user)) { %>
  <form method="POST" action="/hotels/<%= hotel.id %>/comments/<%= comment.id %>">
    <input type="hidden" name="_method" value="DELETE">
    <button>Delete</button>
  </form>
<% } %>
```

Wow, that was a lot of work! But thankfully our comments and hotels are secure and our client is happy!

## Protecting our routes (20 mins)

We've hidden the edit and delete buttons from the user, but we have not protected our controller actions. At the moment, if a user navigates to an EDIT page (simply by adding `/edit` on the end of the SHOW page url), they can still update the listing.

To solve this problem we'll create a new method in our `lib/customResponses.js` file:

```js
function customResponses(req, res, next) {

  .
  .
  .

  res.unauthorized = function unauthorized(url='/login', message='You must be logged in') {
    req.flash('alert', message);
    return res.redirect(url);
  }

  next();
}

module.exports = customResponses;
```

So now we have a nice method on our `res` object which can be used to redirect the user and provide an error message, with sensible defaults.

Let's use it in our `editRoute` method of the hotel controller:

```js
function editRoute(req, res, next) {
  Hotel
    .findById(req.params.id)
    .exec()
    .then((hotel) => {
      if(!hotel) return res.redirect();
      if(!hotel.ownedBy(req.user)) return res.unauthorized(`/hotels/${hotel.id}`, 'You do not have permission to edit that resource');
      return res.render('hotels/edit', { hotel });
    })
    .catch(next);
}
```

Now, if a user attempts to go to the EDIT route of a resource that is not theirs they will be redirected back to the SHOW page for that record, with a helpful error message.

## Independent practise (20 mins)

Update the controller to protect the UPDATE and DELETE routes for both hotels and comments in a similar way.

You can also DRY up your `lib/secureRoute.js`, `lib/authentication.js` and `controllers/sessions.js`, to use the new `res.unathorized()` method.

## Conclusion

As our apps get more complex, we need more and more relationships between our models.

It's important that we understand the difference between **embedded** and **referenced** records, and how to create and display them.

It's often a good idea to wireframe our views before we create our models to help us understand whether we should choose embed or reference our data.

