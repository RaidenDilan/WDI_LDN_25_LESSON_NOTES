# CSS Frameworks

When we are developing apps and web sites, we often have a lot to do. There is HTML templates to make, CSS to write and functionality to develop. When we work in big teams often these jobs are taken care of by different developers with different specialities.

However, when we are working in smaller teams, or on our own, the amount of work needed to get a simple idea to a point where we can begin to show other people (stakeholders, investors, etc.) can be quite overwhelming.

However, there are plenty of resources out there to help us develop attractive sites quickly, so we can concentrate on what it is that our app or website *actually does*. This is where CSS or front-end frameworks come into play.

In this session we will look at one of the more popular CSS frameworks, Bootstrap.

## A little history

Bootstrap was originally released in 2011, however, it was initially known as **Twitter Blueprint**, developed by Mark Otto and Jacob Thornton at Twitter as a side project. They wanted to make something that would be easy to use, and that would lead to a consistent look and feel throughout their internal tools.

Bootstrap is an open-source project hosted on [github](https://github.com/twbs/bootstrap). It is free to use, and adapt as you see fit.

Bootstrap ships with CSS and JS files that should be included in your project. For now we will be looking into the CSS only.

Let's get started!

## Setup

Create a new `html` document, and flesh it out with some boilerplate markup like so:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Bootstrap setup</title>
  </head>
  <body>
    <main>
      <h1>Working with Bootstrap</h1>
    </main>
  </body>
</html>
```

Version 3 is the current stable version, but there is also a `beta` version (Version 4) available. We'll be using v4 for this session. Navigate to the [Bootstrap 4 quickstart instructions](http://v4-alpha.getbootstrap.com/getting-started/introduction/). Under the heading **Quick start** you will see instructions on how to add Bootstrap to your project using a CDN.

> **Note:** you may need to explain what a CDN is at this point.

Add the `link` tag to your markup.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Bootstrap setup</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  </head>
  <body>
    <main>
      <h1>Working with Bootstrap</h1>
    </main>
  </body>
</html>
```

We will need the Javascript links a little later on in the lesson so let's add them now.

```
<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
```

Boostraps Javascript code depends on the jQuery library, so we need to link this above the `bootstrap.min.js` file. Boostrap also depends on a library called [Tether JS](http://tether.io/) for handling certain components (i.e tooltips), and whilst we won't be looking at these today we will get an error if this link isn't also included.

Reload your page. You should see that the font has changed from serif to sans-serif. Some of Boostraps styles are applied automatically if the Bootstrap stylesheet is included in your project, such headings, forms and tables, but some styles are only applied if we use specific Boostrap classes.

## The grid

Let's start applying some Boostrap classes to our elements, so that they take on the look and feel of Bootstrap.

The first thing we need to do is set up a `container`. Let's add a `main` tag with a class of `container` to our markup.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Bootstrap setup</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  </head>
  <body>
    <main class="container">
      <h1>Working with Bootstrap</h1>
    </main>
  </body>
</html>
```

The title of the page should now not sit flush with the edge of the screen. Bootstrap has added a minimum with to your page (roughly 1200px). If you resize the screen, you will see that it is *responsive*. Thanks Bootstrap!

Designers love grids. If you look at magazine layouts, adverts, or indeed websites, you will see that everything is generally aligned to a grid. The most common grid designers use has 12 columns. 12 columns makes sense to design to since you can display 3, 4, 6, 8, 9 or 12 things in a row.

Take the [BBC Sport](http://www.bbc.co.uk/sport) website for example. It has articles set out in a grid of different sizes:

![BBC Sport](http://i.imgur.com/G2pEsil.png)

One of the most important features of a CSS framework is the grid. The Bootstrap grid is made up of three things:

- A container
- Rows
- Columns

The **container** is used to provide a proper width for the layout, acting as a wrapper for the content. Bootstrap rows must live inside a container.

A **row** acts like a wrapper around the columns. The row nullifies the padding set by the container element by using a negative margin value of -15px on both the left and right sides. There's no limit on the number of rows you can create.

A **column** is where we define areas to place the content for the website. A row is made up of 12 columns, and we define how many columns something takes up by giving that element a Bootstrap class. Columns have padding on the left and right, which gives us nice gaps between our elements so that they are not sitting right next to each other.

Column classes are made up of two key declarations:

- The device size you want to target
- The number of columns you want your element to take up (out of 12)

They look something like this: 

```
<div class="col-sm-6">Content</div>
```

The table below shows the device width and corresponsing class prefix for Boostrap column classes:

| Class Prefix  | Device Size     |
| ------------- | --------------- |
| .col-         | <576px          |
| .col-sm-      | ≥576px          |
| .col-md-      | ≥768px          |
| .col-lg-      | ≥992px          |
| .col-xl-      | ≥ 1200px        |

If you think back to our lesson on responsive CSS and media queries you will remember that we can give an element different styles depending on the screen size of the device we are viewing our site on. Boostrap allows us to add multiple column classes to a single element, which means we can define how wide we want an element to appear depending on the device size. 

For example on a medium size screen we may want our columns to take up half of the width of the screen (6 columns out of 12), and on a large size screen we want them to take up a third (4 columns out of 12). We can achieve this by adding two classes to the element.

```html
<div class="col-md-6 col-lg-4">Content</div>
```

It can take a bit of time to get the hang of using column classes, but once you do you will have a powerful tool in your tool belt. Being able to handle a CSS grid well is invaluable, as it will save you a lot of time and energy. 

[Here](http://www.helloerik.com/the-subtle-magic-behind-why-the-bootstrap-3-grid-works) is a great article on why the Boostrap grid works. It is written about the Bootstrap 3 grid, but the principes are the same for Boostrap 4. 

Let's add some rows and columns to our markup, using Bootstrap's grid classes:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Bootstrap setup</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  </head>
  <body>
    <main class="container">
      <h1>Working with Bootstrap</h1>
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-6 col-lg-4">
          <h2>.col-md-6 .col-lg-4</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h2>.col-md-6</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-3">
          <h2>.col-md-3</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div class="col-md-3">
          <h2>.col-md-3</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </main>
  </body>
</html>
```

As you can see you can use the grid to very quickly and effectively create quite complex page layouts.

Two of the most useful features of the Boostrap grid are [offsetting columns](http://v4-alpha.getbootstrap.com/layout/grid/#offsetting-columns) and [nesting columns](http://v4-alpha.getbootstrap.com/layout/grid/#nesting). It is likely that you will find these useful when working on your homeworks/projects. 

## Boostrap Components

As well as the grid system, there are also lots of Boostrap components for us to use, such as buttons, dropdowns, input groups, navigation, alerts, and [lots more](https://v4-alpha.getbootstrap.com/components/alerts/). The idea is that if you have correctly linked the Boostrap CSS and JS, all you need to do is use the write HTML markup with the correct classes the rest of the work is done for you.

###Navbar

Let's have a look at the Boostrap [navbar](https://v4-alpha.getbootstrap.com/components/navbar/). 

Copy and paste the HTML provided above the `<main>` tag in your HTML:

```html
<nav class="navbar navbar-toggleable-md navbar-light bg-faded">
  <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <a class="navbar-brand" href="#">Navbar</a>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="text" placeholder="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>
```

Save and refresh the browser. Magic! A beautifully styled navbar, with minimum work for us. If you resize your browser window you will see that the navbar is also reponsive.

You can see how easily a website can come together when using a framework like Bootstrap. Once you have mastered the grid, the main challenge is to then customise your site so that it no longer looks like a 'Boostrap' site. Using your own CSS file you can override styles that don't fit your sites design, just remember to link it below the Boostrap CSS in the head of your HTML. 

## Over to you

Using the Bootstrap documentation, have a play around with the grid system and the components.

Don't be afraid to ask for help from the instructional team, or **Google**!