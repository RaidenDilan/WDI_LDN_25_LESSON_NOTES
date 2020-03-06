# Express Embedded and Referenced Records: Part 2 Embedded

## Creating an embedded schema

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

## Comments controller functions

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

## Adding create and delete forms

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
ommentSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};
```

Oh dear! We now have two functions named `ownedBy`. Not great, let's refactor:

```js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ ... });

commentSchema.methods.ownedBy = function commentOwnedBy(user) {
  return this.createdBy.id === user.id;
};

const hotelSchema = new mongoose.Schema({ ... });

hotelSchema.methods.ownedBy = function hotelOwnedBy(user) {
  return this.createdBy.id === user.id;
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

## Conclusion

As our apps get more complex, we need more and more relationships between our models.

It's important that we understand the difference between **embedded** and **referenced** records, and how to create and display them.

It's often a good idea to wireframe our views before we create our models to help us understand whether we should choose embed or reference our data.
