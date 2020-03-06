---
title: Front-end Routing with UI-Router
type: Lesson
duration: "1:25"
creator:
    name: Alex Chin, Micah Rich
    city: London, LA
competencies: Front-end MV*
---

# Front-end Routing with UI-Router

### Objectives

- Understand how front-end routing differs from server-side routing
- Build a SPA with multiple pages

### Preparation

- Build a basic Angular app
- Interact with an API
- Download the [starter code](starter-code)

## Intro (5 mins)

Routing, as you've seen in multiple frameworks and languages, is adding in the ability to render different pages in a application – but in a single-page app, how can we have multiple pages? In Angular, it comes down to storing all our views on our main page and turning them on and off as we need.

But what's the benefit? Why even make it single page? Why add that complexity? The main use case for front-end frameworks is added speed – by loading everything upfront, and just switching sections on and off, our page will seem wonderfully speedy because we'll be skipping quite a few steps that a more traditional framework has to run through.

Now, Angular comes with a basic routing mechanism, `ngRoute`, which you can read about [here](https://docs.angularjs.org/api/ngRoute/service/$route).

But today we're looking at a more advanced router: a third-party plugin called [`ui-router`](https://github.com/angular-ui/ui-router);

**Our ultimate goal is to build out two pages – a main Todo list and an Archive page for all the Todos we've completed.**

Let's walk through it.

## Seven Steps to `ui-router` - Codealong (40 mins)

> **Note**: Because of the nature of what we're building today - our URL will be telling our application what particular views to render - we can't use UI-Router with `file://`. This is because UI-Router loads files with `$http`.

Let's begin by setting up our starter-code.

```bash
$ bower i && npm i
```

#### Step One: `ui-router`

Next, we'll need the `ui-router` source. It's not an official Angular core library and it's not hosted on Google's site. However, we can install it using bower:

```bash
$ bower install angular-ui-router --save
```

This will be added to our compiled `public/js/app.js` file in public using our gulp task.

Now, we can start up the app:

```bash
$ gulp
```

#### Step Two: Adding a Dependency

Because we're adding a new library to our app, it'll be a module dependency. We'll need to make sure Angular knows about our library, so we can use it. If you haven't used any external libraries yet, rejoice in that we're finally going to put _something_ in those empty brackets in our `src/js/app.js`.

```javascript
angular
  .module('todoApp', [
    'ui.router'
  ]);
```

`'ui.router'` just happens to be what the library is called in its source. Most libraries will tell you what to write here in their documentation and if you need more than one, just list them like any array.

#### Philosophically, what is routing?

A route, in general, is just the path you take to get somewhere. That's not specific to web development, but it's one of those words we've latched on because it's a good description – when you're changing URL, when that location bar changes, you're on a new route.

Our router just sets up which routes we want to exist and points our code where to make it happen.

This means our Angular app can simulate having multiple pages, which gives us the ability to make more complex applications... which is awesome!

Let's make some routes.

#### Step Three: Add Some Configuration

First, let's add a new configuration file:

```bash
$ mkdir src/js/configs
$ touch src/js/configs/router.config.js
```

Inside there, let's add:

```javascript
angular
  .module('todoApp')
  .config(Router);
```

Of course, now we need a `Router()` function, so let's build one:

```javascript
Router.$inject = ["$stateProvider", "$urlRouterProvider"];
function Router($stateProvider, $urlRouterProvider) {
  // routes to be completed
}
```

The arguments in the function are necessary parts for our router to do its work, however, we're specifically injecting using the `$inject` syntax to ensure that the file will work after minification.

#### Step Four: Add Some Routes

When using Angular, we're not really changing locations (single-page apps, here), let's, instead of calling them _routes_, call them **states**. Same idea as routes but we're just trying to be more descriptive. We're changing the current _state_ of the app, as in a snapshot of the stuff we're looking at and working with, at a particular moment.

```javascript
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/views/home.html'
    });
}
```

That weird `$stateProvider` argument comes from our `ui-router` library, and it allows us to add a state to our application.

We define a **name** for the state. This is important because it's how we can refer to it later.

We also define a **relative url** for each state to tell the browser how to simulate navigating different pages. A `/` here says it'll be the default homepage, basically.

And finally, we add a **templateURL**, which is sort of a partial HTML file. We'll fill a partial with _just_ the code we'd need to change on the page, here.  Remember, it's just a part of a larger HTML page with parts that we can hide.

> **Note:** It is possible to directly add a template instead of a URL here. However, it's rarely used.

Now, before our route can work, we've got to create the view file and add some content.

```bash
$ mkdir src/js/views
$ touch src/js/views/home.html
```

> **Note:** Our gulp file has already been setup to copy these files over. If you want to _change_ where you put these files, you will need to change the gulp task.

#### Otherwise

Before we add some content to this partial, let's also add a catch-all to ensure that we route to the home if no state is found:

```javascript
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "/js/views/home.html",
    });

    $urlRouterProvider.otherwise('/');
}
```

#### Step Five: Building Partials

Go over to our `index.html`. What we want to do is to take (`<cmd-x>`) everything inside our `<main>` tag:

```html
<main>
	... TAKE EVERYTHING INSIDE HERE ...
</main>
```

Now let's add this content inside our `src/js/views/home.html` file. Now you've got a partial, and all we have left to do is tell our `index.html` where we want to put it.

In that `<main>`, on our `index.html`, we'll add a new directive: `ui-view`.

```html
<main ui-view></main>
```

And since our route is a default route at `/`, and our `templateUrl` is already `home.html`, it should actually work!

#### Step Six: One More State!

Of course, that's exactly what we were looking at before, but _now_, we have the ability to switch out that view with different partials, depending on our _state_.

So let's make things interesting and add another state in here. Let's make a state for when we're looking at an archived list. In `src/js/configs/router.config.js`:

```javascript
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/js/views/home.html'
    })
    .state('archive', {
      url: '/archive',
      templateUrl: '/js/views/archive.html'
    });

  $urlRouterProvider.otherwise('/');
}
```

We'll need another partial for `archive.html` and for that one, instead of listing all our todos, let's just list the completed ones.

Our new partial will be almost exactly the same as our last so **duplicate the `home.html` file** and call it `archive.html`. Inside, find our `ng-repeat`:

```html
<li ng-repeat="todo in todos.todosRemaining() track by $index">
```

...and switch that sucker out:

```html
<li ng-repeat="todo in todos.todosCompleted() track by $index">
```

We're 10 seconds away from seeing something awesome. We need one more thing.

#### Step Seven: A Navbar!

In order to jump between one view and the other, we need _links_! But not normal links because we're not changing pages. Luckily, `ui.router` gives us a custom directive. Inside your `index.html`, underneath `header` - let's add a `nav` with a few `a`s

```html
<nav class="tabs">
  <a ui-sref="home">My List</a>
  <a ui-sref="archive">Archives</a>
</nav>
```

That custom directive, `ui-sref` is like `href`, but referencing _states_ instead. That came with our library, and **the text we're putting in there is just the names of the states we defined**.

You already have a little SCSS in your `style.scss` to make it look nice, something like:

```css
nav.tabs {
  background: #4d5d70;
  max-width: 75%;
  margin: 0 auto;
  a {
    display: inline-block;
    background: rgba(255, 255, 255, 0.7);
    color: black;
    padding: 10px 20px;
    margin-right: 1px;
    &.active {
      background: rgba(255, 255, 255, 1);
    }
  }
}
```

Check it out. Click through and jump from page to page. Super awesome, yeah?

#### Helpful Extra - Which state am I on?

`ui.router` actually gives us another really useful custom directive. Throw it on whichever links are using `ui-sref`:

```html
<nav class="tabs">
  <a ui-sref-active="active" ui-sref="home">List</a>
  <a ui-sref-active="active" ui-sref="archive">Archive</a>
</nav>
```

This is a really nice helper that will apply the class of "active" (or whatever you put in quotes) to the link that's currently active, depending on what state you're looking at.

And suddenly, your interface makes a ton more sense. Super helpful.

## `$stateParams`

There are two key parts to UI-Router that we haven't looked at yet.

What if we wanted to make a page for just one To Do item. If we were following the REST conventions then we'd expect it to have a URL similar to `/todos/:id`.

We can achieve this with [`$stateParams`](https://github.com/angular-ui/ui-router/wiki/URL-Routing).

Let's make a new state:

```js
.state('todosShow', {
  url: '/todos/:id',
  templateUrl: '/js/views/show.html'
});
```

Let's make a corresponding view file:

```sh
$ touch src/js/views/show.html
```

Now, we need to create a way to navigate from the home page to one of these specific show pages.

In the `home.html` page, let's add a `more info` link above the delete `<button>`.

```html
<a ui-sref="todosShow({ id: $index })">more info</a>
<button class="btn btn-delete" ng-click="todos.todosDelete(todo)">x</button>
```

We're using a `ui-sref` but this time, we're passing in a value for the params. This should match the `:id` parameter in `router.config.js`.

If you click on this link now, you should see that the url in the browser has changed!

#### How to fetch a specific todo

Now, we have a bit of a problem here. At the moment, our data is being contained in our `ToDosCtrl` which is being loaded when the page initially loads.

Changing between each states does **NOT** reload this controller.

Therefore, we need some what to fetch an item from the array when we load this state. We can do this by adding a new function in the `ToDosCtrl` that uses `$stateParams`.

`$stateParams` is similar to `req.params` in Node but for Angular. It contains an object with information about the url parameters. In order to use it, we need to inject it into our controller's dependencies:

```js
ToDosCtrl.$inject = [`$stateParams`];
function ToDosCtrl($stateParams){
  //
}
```

Then we can use it in a function to fetch one item based on the `:id` value of `$stateParams`.

```js
// Get one todo based on the $stateParams
function todosShow() {
  return vm.todos[$stateParams.id];
}
```

Remember to add it to `vm` with:

```js
vm.todosShow      = todosShow;
```

We can now use this in our `src/js/views/show.html` file.

```html
<section class="todo-list">
  <ul>
    <li>
      {{ todos.todosShow().task }}
    </li>
  </ul>
</section>
```

You should be able to click on the more info link and see this page!

> **Note:** There are **MUCH** better ways of managing data and state between controllers than this. We'll be making lots of separate controllers for each state which access data from external files or APIs. This is just a practise run.

#### Removing the `/#`

You may have noticed that when we change states, our URL has a `#` in it. If we want to remove this we can add:

```js
angular
	.module('todoApp')
	.config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/views/home.html'
		})
		.state('archive', {
			url: '/archive',
			templateUrl: '/views/archive.html'
		});

	$urlRouterProvider.otherwise('/');
}
```

We also need to add a base tag to our `index.html`:

```html
<!DOCTYPE html>
<html ng-app="todoApp">
	<head>
		<meta charset="utf-8">
		<title>To Do Or Not To Do</title>
    <base href="/" />
    <!-- inject:js -->
    <!-- endinject -->
    <!-- inject:css -->
    <!-- endinject -->
	</head>
```

The `<base>` tag in HTML is a relatively little known element, having become a fully fledged part of HTML5 quite recently. It enables you to do two things: Set any URL you choose as the base for all relative URLs.

## Independent Practice (20 minutes)

Having multiple states is really useful, obviously – we can start making a much more complex Angular application.

**What other states would be good to add to your app?** Try adding an about page to start, or even crazier, maybe adding an extra state to be able to _edit_ a todo. Take the next 20 minutes to try, and we'll be here to help if you need it.


## Conclusion (5 mins)

- What's a router? What's it for?
- How do we add routes to our Angular application?
