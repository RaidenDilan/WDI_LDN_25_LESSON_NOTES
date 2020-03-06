---
title: Modeling Relationships
type: lesson
duration: "1:25"
creator:
    name: Gerry Mathe & Mike Hayden
    city: London
competencies: Server Applications
---

>Note: Instructors going by baseline sequence should include a review of the Sinatra weekend lab prior to teaching this lesson.

# Modeling Relationships

### Objectives
*After this lesson, students will be able to:*

- Build models with `has_many`, `belongs_to`, `has_and_belongs_to_many`, and `has_many :through`
- Describe macros that match different relationship types

### Preparation
*Before this lesson, students should already be able to:*

- Create models that inherit from ActiveRecord
- Explain and generate migrations
- Describe a relational database

## Why are relationships important? Intro - 15 mins

A hefty part of designing a relational database is dividing the data elements into related tables. Once you're ready to start working with the data, you rely on relationships between the tables to pull the data together in meaningful ways. For instance, order information is useless unless you know which customer placed a particular order.

By now, you probably realize that you don't store customer and order information in the same table. Instead, you store order and customer data in two related tables and then use a relationship between the two tables to view each order and its corresponding customer information at the same time. If normalized tables are a relational database's foundation, then relationships are the cornerstone.

#### Relationship types

An association, in this context, is a connection between two ActiveRecord models. Associations are implemented using macro-style calls, so that you can declaratively add features to your models. For example, by declaring that one model belongs_to another, you instruct your application to maintain Primary Key-Foreign Key information between instances of the two models, and you also get a number of utility methods added to your model.

- ```has_many``` - Indicates a one-to-many connection with another model. This association indicates that each instance of the model has zero or more instances of another mode.
- ```belongs_to``` - A belongs_to association sets up a one-to-one connection with another model, such that each instance of the declaring model "belongs to" one instance of the other model.
- ```has_and_belongs_to_many``` - A `has_and_belongs_to_many` association creates a direct many-to-many connection with another model, with no intervening model.
- ```has_many :through``` - A `has_many :through` association is often used to set up a many-to-many connection with another model. This association indicates that the declaring model can be matched with zero or more instances of another model by proceeding through a third model.

Let's explain and create these relationships in the context of our application.

## Describe the app and database we're building - Demo - 5 mins

#### The database for this association

The purpose of this application is to show the different kinds of relations between models with ActiveRecord. We will be creating an app called Tunr, which will store information about artists, their albums and genres. We will have the following models:

* Artist
	* name _string_
	* photo _string_
	* nationality _string_

* A model Album
	* title _string_
	* photo _string_
	* release_date _date_
	* price _float_

* A model Genre
	* name _string_

The relationships will be:

* Artist `has_many` albums
* Artist `has_many` genres `through` albums
* Album `belongs_to` an artist
* Album `has_many` genres
* Genre `has_many` albums
* Genre `has_many` artists `through` albums

We're going to be building this from scratch, so let's get started!

#### Setup the app

To setup the app we need to:

```bash
$ rails new tunr -d postgresql
$ cd tunr
$ rails db:create
$ rails g scaffold Artist name photo nationality
$ rails db:migrate
$ rails g scaffold Album title photo release_date:date price:float artist:references
$ rails db:migrate
$ rails g scaffold Genre name
$ rails db:migrate
```

>**Note**: Slack over the seeds file **If students have not used the same naming conventions then it will break, so it might be worth slacking the commands above over...**

Now lets populate the database with some data:

```bash
$ rails db:seed
```

## Create Associations - Code Along - 30 mins

We create relationships with ActiveRecord by adding functions to the models to define what other tables the model is related to. Then, ActiveRecord will take care of of almost everything - by creating relationships in your database - and then populating the foreign_keys columns in the appropriate tables. It will also provide a bunch of useful, dynamic methods for every instance of the model, making it really easy to retrieve data from other models associated with this instance.

#### Create a `has_many` - `belongs_to`

An album will always belong_to an artist. Therefore, if we create two albums and assign them to the same artist, we will be able to list these two albums for this specific artist.

When we scaffolded the album, we set `artist:references` which meant that `ActiveRecord` already did a lot of the grunt work for us. It has created an `artist_id` field in the `albums` table, and added the first reltionship for us in the model:

```ruby
class Album < ApplicationRecord
  belongs_to :artist
end
```

>**Note**: It may be worth showing the database in `psql` so the students can actually see the `artist_id` field that's been created.

#### Updating the view

While Rails is very smart, it does not do absolutely **everything** for us. If we navigate to `/albums/new`, you'll see that the `artist_id` field is a text field with a number in it. This is not great. We should not expect the user to know the id of the atist to associate with the album. What we need is a dropdown. Luckily with rails this is trivial.

In the form `app/views/albums/_form.html.erb`, replace the field for `artist_id` with the following:

```erb
<div class="field">
  <%= f.label :artist %>
  <%= f.collection_select(:artist_id, Artist.all, :id, :name) %>
</div>
```

The magic here is `f.collection_select`, which create a dropdown with the following syntax:

```ruby
f.collection_select(name_of_field, data_from_model, property_to_save, property_to_display_on_dropdown)
```

This will create a dropdown for us with the artists names on the dropdown, and the artists id to be stored in the albums `artist_id` property on save.

This will update the new _and_ edit forms!

We can also update the show page to show the artist associated with the album. In `app/views/albums/show.html.erb` modify the `Artist Id` as follows:

```erb
<p>
  <strong>Artist:</strong>
  <%= @album.artist.name %>
</p>
```

#### Create a `has_and_belongs_to_many`

A `has_and_belongs_to_many` association creates a direct many-to-many connection with another model, with no intervening model. For example, if your application includes cars and parts, with each car having many parts and each part appearing in many cars, you could declare the models this way:

```ruby
class Car < ApplicationRecord
  has_and_belongs_to_many :parts
end

class Part < ApplicationRecord
  has_and_belongs_to_many :cars
end
```

We said when we listed the associations that a genre would have many albums and an album can also have many genres. We will, therefore, need to create a join table to link the resource album and the resource genre.

#### Why a join table?

If you create a `has_and_belongs_to_many` association, you need to explicitly creating a joining table. Why?  Join tables bridge the relationship between two resources that both have many of the other. If one resource `has_many` and the other `belongs_to`, you don’t need a join table, because it can be mapped out in two tables no problem. When they both `has_many` of each other, you need a third table because it creates a third dimension.

> **Note**: It could help to draw creating a join table between parts and cars or albums, genres on the board.

To create a join table for albums and genres, we need to add another table in the database, let's create a migration:

```bash
rails g migration CreateJoinTableAlbumsGenres albums genres
```

Rails will create the following migration:

```ruby
class CreateJoinTableAlbumsGenres < ActiveRecord::Migration[5.0]
  def change
    create_join_table :albums, :genrds do |t|
      # t.index [:album_id, :genre_id]
      # t.index [:genre_id, :album_id]
    end
  end
end
```

Then run the migration:

```bash
rails db:migrate
```

Now, we will need to update the models:

```ruby
class Album < ApplicationRecord
  belongs_to :artist
  has_and_belongs_to_many :genres
end

class Genre < ApplicationRecord
  has_and_belongs_to_many :albums
end
```

#### Updating the view

As before we have to update our view to allow a user to select multiple genres with in the album's form. Modify the form like so:

```erb
<div class="field">
  <%= f.label :genres %>
  <%= f.collection_check_boxes(:genre_ids, Genre.all, :id, :name) %>
</div>
```

This is the same syntax as our dropdown, only it will create checkboxes for us. Note that we are storing the ids in a property called `genre_ids`.

#### Strong params

At the moment, this will still not work, because by default Rails will not allow data to be sent form a form, unless we explicity allow it. This is known as **strong params**.

In `app/controllers/albums_controller.rb`, at the bottom you will see a comment that says:

```ruby
# Never trust parameters from the scary internet, only allow the white list through.
```

Underneath there is a method `def album_params`, which is a _whitelist_ of properties that rails will allow to be sent from this form. We need to add our `genre_ids` like so:

```ruby
# Never trust parameters from the scary internet, only allow the white list through.
def album_params
  params.require(:album).permit(:title, :poster, :release_date, :artist_id, genre_ids: [])
end
```

Note that since we are expecting an array of ids, we have to indicate that with an array.

Finally let's update the show page, to list all the genres of the album, in `app/views/albums/show.html.erb`:

```erb
<p>
  <strong>Genres:</strong>
  <ul>
    <% @album.genres.each do |genre| %>
      <li><%= genre.name %></li>
    <% end %>
  </ul>
</p>
```
## Independent Practice - Add another association - 20 mins

Its over to you... Using the web, find out how to add a relationship between Artist and Genre, using a `has_many` `through` associaiton.

For this relationship, *you just need to add methods in the models, but you do not need to change the database structure!*

[This guide](http://guides.rubyonrails.org/association_basics.html) about ActiveRecord contains all the details about the different types of relationships. Use it for this exercise.

## Conclusion (5 mins)
Review the solution to the previous independent practice activity. Then discuss these questions:

- Describe why we need a join table for a `has_and_belongs_to_many` relationship?
- What is the name of the columns in the database which stores an id from another table?
- What is the command that executes the migrations to your database?