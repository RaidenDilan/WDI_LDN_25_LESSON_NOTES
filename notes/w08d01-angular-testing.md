---
title: Intro to Testing with Angular
type: lesson
duration: "1:15"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, MV* Frameworks
---

# Intro to Testing with Angular

### Objectives
*After this lesson, students will be able to:*

- Write unit tests for controllers in Angular
- Create a test suite using Karma, Mocha and Chai

### Preparation
*Before this lesson, students should already be able to:*

- Have some experience of writing tests with Mocha and Chai
- Create Angular controllers

## Setup (10 mins)

Before we actually write some tests, there's quite a lot of setup involved. Let's start by talking through the different packages we'll be using.

### [Karma](http://karma-runner.github.io/1.0/index.html)

Karma is a test-runner for client side testing. In order to test Angular we need something that can spin up a browser, run the tests, report the results to the command-line, then quit the browser for us. That's where Karama comes in. Karma is the de facto choice for Angular testing.

### [Mocha](https://mochajs.org/)

Mocha is a testing framework, used to write tests. It provides us with `describe` and `it` methods along with a few other bits and pieces.

Often if you look into documentation for Angular testing you will see mention of [Jasmine](https://jasmine.github.io/index.html) as the testing framework of choice. While Jasmine is a great framework, since we are already using Mocha for our server-side tests, it makes sense to stick with it on the client-side.

### [Chai](http://chaijs.com/)

Chai is an assertion library. It's the thing that allows us to write things like:

```js
expect(thing).to.be.an('object');
```

Mocha doesn't come with its own assertion library, so we have to pick one ourselves. Chai is a great fit.

### Installing our depenedencies

Ok, now we know what we're using we need to install the following packages into our project:

```sh
$ npm i --save-dev karma chai mocha karma-chai karma-mocha
```

>**Note:** `karma-chai` and `karma-mocha` allow `karma` to work with `mocha` and `chai`.

We also want to run our tests from the command line, so we'll install Karma's Command Line Interface (CLI):

```sh
$ npm i -g karma-cli
```

## Configuring Karma (20 mins)

Karma needs to know some things about our project before it can begin to run our tests. The simplest way to configure Karma is by typing `karma init` in the terminal. This will step you through setting up a config file.

Use the following settings:

```
Which testing framework do you want to use?
Press tab to list possible options. Enter to move to the next question.
> mocha

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no
 
Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
> 

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
> 

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> no
```

A config file `karma.conf.js` will have been created in your project. You'll need to amend it slightly.

```js
frameworks: ['mocha', 'chai'], // add chai here

reporters: ['dots'], // change progress to dots

singleRun: true, // change false to true
```

### `angular-mocks`

When testing an Angular app, we don't actually load up the app on some HTML. Instead we load certain bits of the app into memory so we can test them. In order to do this, we need another script called `angular-mocks`, which we'll download with bower:

```
$ bower i --save-dev angular-mocks
```

### Loading our files

Karma needs to know which files to load into the browser in order to run angular and the app, but also to run our tests. Update the `files` array in `karma.config.js` like so:

```js
files: [
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'src/js/app.js',
  'src/js/**/*.js',
  'test/client/**/*.js'
],
```
Let's create a test file. Make a folder `test` and inside that a `client` folder. We don't want Karma to run any server-side tests. Now we can create a test file `coffeeIndexCtrl.js`:

```sh
$ mkdir test && mkdir test/client && touch test/client/coffeeIndexCtrl.js
```

## Writing our first test (20 mins)

Ok, we're nearly there. We now need to actually write a test. In order to do that we're going to need to inject some things into our test suite. We need to load in the controller we want to test, but we also need to create a `$scope` object and pass it in. Remember, we're not going to actually load the whole app into the DOM, but rather instantiate the parts we need.

Let's start with a `describe` block:

```js
describe('coffeeIndexCtrl', () => {

});
```

Now before each test, we want to get hold of our `coffeeAssembly` app. We'll use the `angular-mocks` helper function `module` to do that:

```js
describe('coffeeIndexCtrl', () => {
  beforeEach(module('coffeeAssembly'));
});
```

This is similar to using `ng-app="coffeeAssembly"` in the DOM.

Now we need the controller and `$rootScope`. We do that like so:

```js
let $rootScope;
let $controller;

beforeEach(inject((_$rootScope_, _$controller_) => {
  $rootScope = _$rootScope_;
  $controller = _$controller_;
}));
```

`$controller` is similar to `ng-controller`, it is a function that let's us instantiate a controller by name. `$rootScope` is the global scope object, that we've injected into controllers in the past. We'll be needing it shortly.

### What are we actually testing?

For our first foray into Angular testing, we'll be testing to see if our `filterCoffee` function on the controller works. Let's start with a describe block:

```js
describe('filterCoffee', () => {
  let $scope, vm;
});
```

We've also created a couple of variables to hold a `$scope` object and the controller. Let's make those now:

```js
describe('filterCoffee', () => {
  let $scope, vm;
  
  beforeEach(() => {
    $scope = $rootScope.$new();
    vm = $controller('CoffeeIndexCtrl', { $scope });
  });
});
```

So we've created a `$scope` object, then injected it into our `CoffeeIndexCtrl` instance, which we've stored in `vm`.

We haven't injected out `Coffee` model, and this is for good reason. We only want to test the controller. The model is a different part, so we can fake the data in the controller. By faking data in the test we know that we are only testing the controller, and are not relying on something else which might break.

```js
describe('filterCoffee', () => {
  let $scope, vm;
  
  beforeEach(() => {
    $scope = $rootScope.$new();
    vm = $controller('CoffeeIndexCtrl', { $scope });
    vm.all = [{
      name: 'a',
      strength: 4,
      roast: 1
    },{
      name: 'b',
      strength: 2,
      roast: 5
    }];
  });
});
```

That's all the test data we need.

OK, so _finally_ we can write our first test!

```js
it('filters coffee by name', (done) => {
  vm.q = 'a';
  $scope.$digest();
  expect(vm.filtered.length).to.equal(1);
  expect(vm.filtered[0].name).to.equal('a');
});
```

`$scope.$digest()` is telling angular to run the watchers in the controller and update the view. Normally this would happen automatically when the search input was updated, but since there are no broswer events triggered during the test, we must do it ourselves.

Let's run the test:

```
$ karma start
```

You should see the test pass!

## Independent practise (20 mins)

It's over to you. Go ahead and add tests for strength and roast to make sure that the `filterCoffee` method works for all three properties.

>**Note:** Don't forget that you will need to set `vm.useStrength` and `vm.useRoast` to be true if you want the new `strength` and `roast` properties to affect the filter! 

## Conclusion (5 mins)

Angular testing is quite painful to setup, since the syntax is a little odd, and there's quite a lot of work required for a seemingly small payoff. However, remember that the initial setup only need to be done once.

In this session we have only tested a controller. We can also test filters, services, factories, providers, directives, pretty much anything.

For more information on testing Angular apps, take a look at the following articles:

- [Angular Unit Testing Guide](https://docs.angularjs.org/guide/unit-testing)
- [Angular End to End Testing Guide](https://docs.angularjs.org/guide/e2e-testing)

>**Note:** both of the above articles favour Jasmine for the test framework. Our setup will work just as well, but the syntax for the tests will be very slightly different.

- [An Introduction to Unit Testing in Angular](https://www.smashingmagazine.com/2014/10/introduction-to-unit-testing-in-angularjs/)

>**Note:** Uses Mocha and Chai