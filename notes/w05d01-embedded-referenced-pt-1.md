# Express Embedded and Referenced Records: Part 1 Referenced


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

## Displaying the user that created the hotel in the view

Currently the `createdBy` property of the model is simply the user's id. If we were to print it out on the view it would just be a long string of numbers and letters.

To get the full user object we can use the `.populate()` method in our controller. First find the hotel, then populate the `createdBy` property.

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

## Edit and delete buttons

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

Ok, great, we're done for this part, stay tuned for part 2!

