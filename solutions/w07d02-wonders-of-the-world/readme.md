![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

## Angular UI-Router & Google Maps

### Introduction

Your task is to build an Angular app that consumes an Express API, containing the Seven Wonders of the World! The API has already been built for you, and the seeds file has been filled out.

Use the 'ToDos' app from today's lesson as reference.

### Requirements

* Use `$http` to make requests to the API.
* Use [AngularUI Router](https://github.com/angular-ui/ui-router) to create a state for the 'index' page, which shows a list of all wonders.
* Create a second state for the 'show' page, which shows a single wonder.
* The url for the 'show' page should be `/wonders/:id` in the router, so you will need to use `$stateParams` to load the correct wonder on the page.
* Your 'index' page should display when the app loads.
* Use a custom Google Maps directive to show a map for each location on the show page.
* You do not need to be able to create, edit or delete a wonder.

**Important:** When you make your `$http` request, you will need to prefix it with `/api`. For example, to get all wonders, the entire url will be `/api/wonders`.


### Bonus

* Create a custom directive for an individual wonder on the index page, like we did with 'Cards Against Assembly'.