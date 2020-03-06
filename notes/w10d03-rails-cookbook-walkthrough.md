![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Ruby on Rails - Cookbook App Walkthrough

### Introduction

Before we start building our cookbook app, we first need to plan our models.

Our two models are going to be 'Recipe' and 'Category', and they will have the following fields:

##### Recipe
* ingredients - `text`
* method - `text`
* cooking-time - `integer`
* servings - `integer`
* difficulty - `integer`
* name - `string`
* category - `integer`

##### Category
* name - `string`

The relationship between 'Recipe' and 'Category' will be:

* A recipe `belongs_to` a category 
* A category `has_many` recipes

### Creating the Rails app

In order to create our Rails app run the following commands in the terminal.

```sh
rails new cookbook -d postgresql
```

This is saying, create a new Rails app, call it 'cookbook', and use a PostgreSQL database. Let's `cd` into the newly created `cookbook` directory.

```sh
`cd cookbook`
```

### Adding Categories

Let's create our first model, 'Category', and define the fields we want to include.

```sh
rails g scaffold categories name:string
```

Next we need to create our database. From the terminal run:

```sh
rails db:create
```

You should see something that looks like this:

```sh
Created database 'cookbook_development'
Created database 'cookbook_test'
```

Then, we need to run the migration that Rails created for us:

```sh
rails db:migrate
```

You should see something that looks like this:

```sh
== 20170405150527 CreateCategories: migrating =================================
-- create_table(:categories)
   -> 0.0088s
== 20170405150527 CreateCategories: migrated (0.0088s) ========================
```

Check our your app by running `rails s`, and in Chrome navigate to `localhost:3000`.

You will see something that looks like this:

![Rails](http://i.imgur.com/OMqSWn6.jpg)

If we go to `localhost:3000/categories` you will to taken to the index of categories. At the moment, we have no categories, but we can click on "New Category" and be taken to a form where we can add a category.

_Amazing!_ 🙌

### Adding Recipes

Let's scaffold our recipes. Stop the Rails server and then in the terminal run:

```sh
rails g scaffold recipes name ingredients:text method:text cooking_time:integer servings:integer difficulty:integer category:references
```

In Atom, have a look at the migration file that has been created by running this command. Have a look inside `db/migrate`, and look at the `.rb` file inside.

Next we need to run the new migration that Rails has created for us by running the following in the terminal:

```sh
rails db:migrate
```

> **Note:** We don't need to run `rails db:create` again, because we have already created the database for our app. We only need one database, and then we can create multiple tables for that database, i.e one table for categories, and one table for recipes.

Start up the Rails server again by running `rails s`. Now navigate to `localhost:3000/recipes`. Click on "New Recipe", and add a recipe.

For "Category", we will need to put in the category ID, so for now, put `1`.

### Updating the views

##### Index

When we look at the categories index page now, we can see that the category is being displayed as a string representation of the entire category object. If we just want to display the name of that category, we will need to update the view.

Inside `app/views/recipes/index.html.erb` change:

```html
<td><%= recipe.category %></td>
```

To:

```
<td><%= recipe.category.name %></td>
```

##### Show

If we want to change the show page as well, inside `app/views/recipes/show.html.erb` change:

```html
<%= @recipe.category %>
```

To:

```
<%= @recipe.category.name %>
```

### Creating a static route

If we wanted to create static pages for our site, such as a home page and an about page, we need to create a controller. 

In the terminal run:

```sh
rails g controller static home about
```

If you navigate to `localhost:3000/static/home` in Chrome, you will see the new page.

Inside `config/routes.rb` change:

```rb
get 'static/home'
```

To:

```rb
root 'static#home'
```

To update the about route, change:

```rb
get 'static/about'
```

To:

```rb
get '/about', to: 'static#about'
```

Now, the homepage of our app will be the home page, and the about page will be found at `/about`.

_Fantastic!_ 👌

### Adding a navbar

Inside `app/views/application.html.erb` let's add a navbar. Inside the `<body>` tag, about the `<%= yield %>`, add:

```html
<body>
  <nav>
    <ul>
      <li><%= link_to 'Home', root_path %></li>
      <li><%= link_to 'Recipes', recipes_path %></li>
    </ul>
  </nav>
  <%= yield %>
</body>
```

### Adding a categories dropdown

When we are adding a new recipe, we don't want to have to enter the category ID. It would be much nicer to have a dropdown to choose the category from.

Inside `app/views/recipes/_form.html.erb`, we want to change the text input for `category_id` to be a dropdown, but we are going to use a Rails helper.

Replace the following code:

```html
<div class="field">
  <%= f.label :category_id %>
  <%= f.text_field :category_id %>
</div>
```

With:

```html
<div class="field">
  <%= f.label :category_id %>
  <%= f.collection_select :category_id, Category.all, :id, :name %>
</div>
```

Check our `localhost:3000/recipes/new`, and you should see a dropdown with your categories inside.

_Great job!_ ✌️

### Adding custom CSS

Go to `app/assets/stylesheets/application.css`.

We can write any custom CSS underneath the following:

```css
 *
 *= require_tree .
 *= require_self
 */
```

For example:

```css
 *
 *= require_tree .
 *= require_self
 */
 
 body {
   background-color: red
 }
```

If you want to use SASS, rename the `application.css` file to be `application.scss` and Rails will convert your SASS to CSS.