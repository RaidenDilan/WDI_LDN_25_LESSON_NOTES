![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Complex Relationships with Rails API & Angular

### Introduction

In an earlier lesson we built out a Rails API with some more complex relationships, where two models can have two different types of relationships with each other. In this lesson we are going to look at how we can hook up an Angular front end to this API. 

Open up the `starter-code` in Atom, and check out the folder structure. At the moment a user is able to:

* Register and login
* Perform CRUD actions on the event resource
* Comment on an event

We want to add the following functionality:

* A user can add or remove `attendees` to an event when they create or edit it
* A user can add or remove themselves from the `attendees` of an event

In the terminal, inside `angular-app`, run the following in the terminal:

```sh
yarn install
gulp
```

Inside the `rails-api` run:

```sh
bundle
rails db:drop db:create db:migrate db:seed
rails s
```

### The `current_user` method

If you register and login, and try and create a new event, you should see the following error in the Chrome console:

![422 Error](http://i.imgur.com/JOaBacM.png)

The key part here is `{"user":["must exist"]}`. We are getting this error because in the `Event` model, we have said that an event `belongs_to` a user. Therefore, when we create the event, we must assign a user. Not to worry - this is an easy fix!

In the JWT authentication lesson, we set up a custom method in our `ApplicationController` called `current_user`, which will return the currently logged in user if there is one. We can use this method inside our `CommentsController` and `EventsController`, to assign the logged in user to our new comment or event when it's created.

Inside the `create` method in `app/controllers/events_controller`, add the following line:

```ruby
def create
  @event = Event.new(event_params)
  @event.user = current_user

  if @event.save
    render json: @event, status: :created, location: @event
  else
    render json: @event.errors, status: :unprocessable_entity
  end
end
```

We can do the same thing inside the `create` method in `app/controllers/events_controller`:

```ruby
def create
  @comment = Comment.new(comment_params)
  @comment.user = current_user

  if @comment.save
    render json: @comment, status: :created, location: @comment
  else
    render json: @comment.errors, status: :unprocessable_entity
  end
end
```

### Protecting states and routes

Take a minute to have a look at the "Edit" and "Delete" buttons on the event show page.

```html
<button ui-sref="eventsEdit({id: eventsShow.event.id})" ng-if="main.isAuthenticated() && main.currentUser.id === eventsShow.event.user.id">Edit</button>
<button ng-click="eventsShow.delete()" ng-if="main.isAuthenticated() && main.currentUser.id === eventsShow.event.user.id">Delete</button>
```

The key thing that we want to look at here is the `ng-if` conditions. We only want to show these buttons if the user is logged in, and the event belongs to them. We can use the `main.isAuthenticated()` function to first of all check if there is a JWT token in local storage, and if there is we will then check whether or not the currently logged in user's ID matches the ID of the user who owns the event. If both are true then we show the buttons.

However, just because the buttons are hidden, you would still be able navigate to `http://localhost:3000/events/1/edit` in Chrome, and reach the edit page for the event with an ID of 1. Luckily there is some code in the `MainCtrl` that is preventing this from happening if a user is not logged in.

```js
const protectedStates = ['eventsNew', 'eventsEdit'];

$rootScope.$on('$stateChangeStart', (e, toState) => {
  if((!$auth.isAuthenticated() && protectedStates.includes(toState.name))) {
    $state.go('login');
    vm.message = 'You must be logged in to access this page.';
  }
});
```

Here we are creating an array of protected state names (the names we give each state in `config/router.js`), and then each time we start to change to a different state, we check whether the user is not logged in, and if the state is in that array, and if it is, redirect the user to the login page and tell them they should be logged in to view that page. Neat!

**Note:** We are already protecting the new, edit and delete API routes from users who aren't logged in by having the following line in the `ApplicationController`:

```
before_action :authenticate_user!
```

We then allowing unauthorized user to view events by including the following in the `EventsController`:

```ruby
skip_before_action :authenticate_user!, only: [:index, :show]
```

We are doing the same in the `CommentsController` too.

We can prevent a logged in user from deleting another user's comments or events by adding the following line to the `destroy` method inside the `EventsController`:

```ruby
def destroy
  return render json: { errors: ["Unauthorized"] } if @event.user != current_user
  @event.destroy
end
```

And in the `CommentsController `:

```ruby
def destroy
  return render json: { errors: ["Unauthorized"] } if @comment.user != current_user
  @comment.destroy
end
```

### Display event attendees

Because of the work that we did yesterday when setting up the Rails API, we can access the users who are attending an event by saying `event.attendees`. Let's loop through them using `ng-repeat` and display them on the show page. Underneath the "Attending" heading, add the following HTML:

```html
<ul>
  <li ng-repeat="attendee in eventsShow.event.attendees">{{ attendee.username }}</li>
</ul>
```

You should see a list of attendees being printed out next to the event information.

<img src="http://i.imgur.com/FQkfRmn.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

### Checklist-model

When a user creates or edits an event, we want to see some checkboxes that loop through all users in the database, and print them on the page. We then want to create an array of user IDs to send back to the Rails API to populate the join table between users and events.

Unfortunately, this concept of creating an array of user IDs can be quite fiddly with Angular, but luckily there is a super simple directive we can use to do this for us called [Checklist-model](https://vitalets.github.io/checklist-model/). 

Behind the scenes this directive will construct the array of IDs that we need, and it will also check the checkboxes of users who are already in the array (when editing an event). The only prerequisite for this to work straight out of the box is to add `user_ids` to the `Event` serializer.

Install the directive by running the following in the terminal inside `angular-app`:

```sh
bower install checklist-model --save
```

Next we need to add it as a dependency to our app:

```js
angular
  .module('eventApp', ['ui.router', 'ngResource', 'satellizer', 'checklist-model'])
  .constant('API_URL', 'http://localhost:3000/api');
```

### Updating new form

Let's use this new directive to create checkboxes on the new event form. We want to loop through all of the users in the database, so in the `EventsNewCtrl` we have injected the `User` factory, and assigned the result of the `query()` to `vm.users`. 

Above the "Create" button add the following HTML:

```html
<label for="location">Attendees</label>
<label ng-repeat="user in eventsNew.users">
  <input type="checkbox" name="attendees" checklist-model="eventsNew.event.attendee_ids" checklist-value="user.id" > {{ user.username }}
</label>
```

If you print out `{{ eventsNew.event }}` somewhere on the page, you should see user IDs being pushed and pulled out of the `attendee_ids` array as you check and uncheck the checkboxes. Nice! This is doing lots of work for us.

If you click on "Create", you should see your chosen users being listed underneath "Attending" on the event show page.

### Updating the edit form

We can copy and paste the newly added HTML from the new form to the update form, and just change the name of the controller:

```html
<label for="location">Attendees</label>
<label ng-repeat="user in eventsEdit.users">
  <input type="checkbox" name="attendees" checklist-model="eventsEdit.event.attendee_ids" checklist-value="user.id"> {{ user.username }}
</label>
```
Check that you can update the people attending an event.

<img src="http://i.imgur.com/AekGI5A.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

### Attend an event

Our app allows users to decide whether or not they are going to attend an event. We want to add a button that will toggle whether or not the currently logged in users's ID is inside the `attendee_ids` array or not.

On the event show page, just before the edit button, add the following:

```html
<button ng-click="eventsShow.toggleAttending()">Attend</button>
```

We are going to write a function called `toggleAttending` inside the `EventsShowCtrl` which will push or splice our ID out of the array on click.

```js
function toggleAttending() {
  const index = vm.event.attendee_ids.indexOf(vm.currentUser.id);
  if(index > -1) {
    vm.event.attendee_ids.splice(index, 1);
    vm.event.attendees.splice(index, 1);
  } else {
    vm.event.attendee_ids.push(vm.currentUser.id);
    vm.event.attendees.push(vm.currentUser);
  }
  eventsUpdate();
}

vm.toggleAttending = toggleAttending;
```

First of all we need to find the index of the ID of the current user in the array of `attendee_ids`. We can use the result of the `indexOf()` method to either push or splice the ID from the array before we invoke the `eventsUpdate` function.

The key thing to note here is that just pushing or splicing the ID out of the array isn't going to update the view (where we are looping through `attendees`, unless we reload the page. Instead of reloading, we can just use the same index to either push or splice the whole user object out of the `attendees` array, which will update the view for us thanks to Angular's two-way binding.

Test this out. When you click on "Attend", you should see your username appearing or disappearing from the list of attendees.

Ideally we would like the text on the button to change depending on whether or not the user is already attending or not. There are a few ways we could approach this, but we are going to add a second button that says "Leave", and then write a function called `isAttending` that checks whether or not the user is already attending and shows or hides the buttons depending on the result.

Inside `EventsShowCtrl` add the following function:

```js
function isAttending() {
  return $auth.getPayload() && vm.event.$resolved && vm.event.attendee_ids.includes(vm.currentUser.id);
}

vm.isAttending = isAttending;
```

Here we will return either true or false depending on whether or not all three of these conditions are true:

1. There is a JWT token in local storage
2. The event data has been returned from the database (the promise is resolved)
3. The currently logged in user ID is inside the `attendee_ids` array.

If all three are true then we will show the "Leave" button. If the first two are true then we will show the "Attend" button, else we don't show either button.

Update the HTML to be the following:

```html
<button ng-click="eventsShow.toggleAttending()" ng-if="main.isAuthenticated() && !eventsShow.isAttending()">Attend</button>
<button ng-click="eventsShow.toggleAttending()" ng-if="main.isAuthenticated() && eventsShow.isAttending()">Leave</button>
```

Check that this is working by adding and removing yourself from the event.

### Conclusion

We have covered quite a lot here, but you will now have a good example of a more complex set of relationships to use as a reference as we move towards project week.