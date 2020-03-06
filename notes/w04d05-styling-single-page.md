# Styling a Single Page Website

Let's use what we learnt this morning about the fundamentals of good website design and style a single page website for a coffee shop chain. Here is what the finished website will look like:

![Coffee Assembly](http://i.imgur.com/FxecD6i.jpg)

Open up the starter code, and you will see that the setup for our app has already been done. If you open up the `src` folder you will see that it is split into `js`, `css` and `assets`. Inside `assets` there is a folder for images and one that holds a menu PDF. Inside the `css` folder you will see that there is a folder that contains the SASS version of Boostrap, ready for us to import. 

Open up the Gulpfile. You will see that there are tasks to copy over the HTML and assets to the `public` folder, one to convert SASS to CSS, and another to transpile the JS from ES6 to ES5. There is also a task that will run `nodemon` for us, so all we need to do is run `gulp`. Nice!

Have a look at the `index.html` file. You can see that we have our content here ready to style. You might recognise some of the class names as part of the Boostrap grid.

In the terminal run `npm i` and `gulp`, and then navigate to `localost:3000` in your browser. Not pretty. Let's do something about it!

### Boostrap Grid

Sometimes you might only want to use part of a CSS framework, for example, only using the grid system. Boostrap makes this easy for us, as the SASS version of the framework has a partial called `bootstrap-grid.scss`, which imports only the styles related to the grid. If we import this file into our own `style.scss` file we will pulling in only the Boostrap styles that we need.

At the top of your `style.scss` file add the following:

```css
@import "bootstrap/bootstrap-grid";
```

Refresh the browser and you should see that the Boostrap grid has kicked in. Cool! Bootstrap is doing a lot for us here by creating rows and columns, but we still have a lot of custom styling to do.

### Type

The typeface for the design is a Google Web Font called [Karla](https://fonts.google.com/specimen/Karla). Click on 'Select this font', then click 'Customize', select 'regular 400' and 'bold 700'. Grab the link and add it to the `<head>` of your `index.html`.

```
<link href="https://fonts.googleapis.com/css?family=Karla:400,700" rel="stylesheet">
```

In your CSS add the following:

```css
body {
  font-family: 'Karla', sans-serif;
}

* {
  font-family: inherit;
}
```

This will insure that all elements are given the Karla typeface, including buttons and input elements. 

Let's also set some default typography styles. Add the following to your CSS:

```css
a {
  color: black;
  text-decoration: none;
}

h1, h2, h3 {
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0;
}
``` 

Refresh Chrome to check out these updates.

### Viewport Units

Having large, high resolution images that fill the entire screen is a common trend in website design. Let's make the image at the top of our website fill the entire height and width of the screen. But how do we know how high to make it? A user could be viewing our site on any number of screen sizes. 

This is where the viewport unit comes in. If we make something `height: 100vh` it will take up 100% of the screen height of that device. Check out the browser support for viewport units [here](http://caniuse.com/#feat=viewport-units). 

In your CSS add the following:

```css
#hero {
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('../assets/images/hero-image.jpg');
  background-position: center;
  background-size: cover;
}
```

The `linear-gradient` property here gives our image a darker overlay to ensure that the white text 'pops' against the background. 

Let's target the `<h1>` tag inside the `#hero` div and position it right in the middle. Update your CSS as follows:

```css
#hero {
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('../assets/images/iced-coffee.jpg');
  background-position: center;
  background-size: cover;
  position: relative;
  h1 {
    font-size: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
  }
}
```

We set the `#hero` div to be `position: relative` so that we can position the `<h1>` tag absolutely inside it. We use percentages to move the `<h1>` half way down from the top, and half way across from the left, and then use the `transform` property to shift it slightly so that it sits right in the middle. If you aren't sure what `transform` is doing here then open up your dev tools, inspect the element and toggle the property on and off. 

### Navbar

The design of the site calls for the navbar to be fixed at the top of the page, so that it stays in view when the page is scrolled. We also need to remove the default list styling of the `<ul>` and make the `<li>` tags inline block so that they sit next to each other. Add the following to your CSS file:

```css
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: 40px;
  nav {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        display: inline-block;
        float: right;
        margin-left: 20px;
        line-height: 40px;
        &:last-of-type {
          margin-left: 0;
        }
        a {
          color: white;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: bold;
        }
      }
    }
  }
}
```

Notice the `:last-of-type` selector here. We can use this to remove the unnecessary margin on the last `<li>`. Refresh your browser and check out the header. Looking good!

### :before & :after

Let's add some hover styles for the navigation links. When you hover over a link you should see a thick white line underneath. Unfortunately this can't be done with `text-decoration: underline`, as there is no way to control the position or thickness of the line.

Instead we can use an `:after` selector to create a 'pseudo element' in the DOM. A pseudo element allows you to insert content onto a page using CSS (without it needing to be in the HTML). 

Add the following to the `a` selector in your CSS:

```css
a {
  color: white;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: bold;
  position: relative;
  &:after {
    content: "";
    height: 2px;
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: -4px;
    left: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &:hover {
    &:after {
      opacity: 1;
    }
  }
}
```

Here we are creating an element that is 2px high, 100% wide, and is positioned absolutely underneath each link. Also note the hover state for the link, which changes the opacity of the `:after` from 0 to 1. Refresh the brower and hover over each link, and you will see the `:after` appear with a 0.2 second transition.

### Fun with jQuery

The navigation is looking good, but we will have an issue once we have scrolled past the hero image, as the white links won't show up on a white background. 

Let's use some jQuery to toggle a class on the header which gives it an transluscent background, so that the white text is readable.

First of all add the following styles to the end of your `header` styles:

```css
background-color: rgba(20, 20, 20, 0);
transition: background-color 0.2s ease;
&.opaque {
  background-color: rgba(20, 20, 20, 0.6);
}
```

When a class of "opaque" is added to the `<header>` tag, the background of the header will have an alpha value of 0.6, making it transluscent. Adding a transition property will give it a fade in/fade out affect as the class is toggled on and off.

jQuery has been included in the `<head>` so we can start using it straight away. In your `app.js` file add the following:

```
$(()=> {

  const $header = $('header');
  const $window = $(window);
  
  $window.scroll(updateHeader).trigger('scroll');

  function updateHeader() {
    const bottomOfHeader = $header.offset().top + $header.height();
    const viewportHeight = $window.height();

    if(bottomOfHeader >= viewportHeight) {
      $header.addClass('opaque');
    } else {
      $header.removeClass('opaque');
    }
  }

});
```

On we are listening for a scroll event on the window, which will call the `updateHeader` function.

Inside the function we save the height of the window inside `viewportHeight`, then we calculate the position of the bottom of the header. If the bottom of the header is equal to or greater than the bottom of the first section (the value of the viewport height), we add the "opaque" class, and if not we remove it.

Refresh your browser to check that it is working.

### Colour

Outside of the images, our site uses colour sparingly - for the section dividers, and the menu links. Let's create a variable at the top of the CSS file which stores our brand colour, so that we only have to type out the HEX code once. 

```css
$brand-color: #c99124;
```

### Sections

Let's add some default styling to our `<section>` tags:

```css
section {
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
  position: relative;
  border-bottom: 2px solid $brand-color;
  h2 {
    font-size: 28px;
  }
  &:last-of-type {
    border-bottom: 0;
  }
}
```

The `:last-of-type` selector here is locating the last section and removing the border from it. Notice that we are using the `$brand-color` variable here to style the border.

### Links

Let's add some styling for the links to the cafe menus. Add the following to your CSS:

```css
#menus {
  a {
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 2px solid $brand-color;
    padding: 5px 10px;
    font-weight: bold;
    color: $brand-color;
    display: inline-block;
    &:hover {
      border-style: dotted;
    }
  }
}
```

By adding `display: inline-block` we are preventing the links from overlapping when they stack on top of each other on a smaller screen. Refresh the browser and check out the hover state.

### Background Images

If we have a look at the design we can see that each of the gallery images are square. If the images provided aren't exactly square, and we don't want to have to crop them, there are some CSS tricks we can use. Instead of using `<img>` tags we can use divs with background images. 

Add the following code to your CSS:

```css
#gallery {
  .image {
    background-position: center;
    background-size: cover;
    &:after {
      content: "";
      padding-bottom: 100%;
      display: block;
    }
    &.image-one {
      background-image: url('../assets/images/image-one.jpg');
    }
    &.image-two {
      background-image: url('../assets/images/image-two.jpg');
    }
    &.image-three {
      background-image: url('../assets/images/image-three.jpg');
    }
  }
}
```

There's quite a lot going on here, so let's break it down. At the top there are some default styles that apply to all of the images. Each of the images have a unique class, which will determine which image is used as a background image. 

The next piece of code is taken from this [blog post](https://spin.atomicobject.com/2015/07/14/css-responsive-square/) on how to make a responsive square using CSS.

```css
&:after {
  content: "";
  padding-bottom: 100%;
  display: block;
}
```

This is what is doing the magic for us, and creating images that stay square when the page is resized. Nice!

### Footer

The footer is fairly simple. Add the following code to your CSS file:

```css
footer {
  background-color: rgba(20, 20, 20, 1);
  padding: 10px 0;
  text-align: center;
  color: white;
}
```

Here we are using the same colour as the background that was used for the header, but changing the alpha value to 1, making it totally opaque.

### More jQuery Fun

Our side is looking great, and we are done with CSS, but there is one last thing to add to make the navigation of our site work. The idea is that when you click on each link the page will scroll down to the corresponding section.

In your `app.js` add the following:

```js

const $links = $('nav a');
$links.on('click', scrollToSection);

function scrollToSection() {
  const section = $(this).attr('href');
  $('body').animate({ scrollTop: $(`${section}`).offset().top}, 1000);
}
```

Here we are listening to a click on the header links, which then calls the `scrollToSection` function.

Inside the function we then grab the href of the link and store it inside `section`. We then use `.animate()` to scroll the body to the section with that id. 

Refresh your browser and test it out.

### Google Maps

Finally let's add a Google Map to our site so that customers can find the coffee shop. Google Maps has great [documentation](https://developers.google.com/maps/), which makes it super easy for us to get set up.

We are going to use the JavaScript setup code which can be found [here](https://developers.google.com/maps/documentation/javascript/adding-a-google-map), but first of all we need to get an API key. We will cover what an API is in the next module. 

At the top of the page click 'Get a key', then click 'Select or create a project'. Click '+ Create a new project' and then choose a project name, then click 'Create and enable API'. You will be given a long string made up of letters and numbers, which is unique to you. Copy and paste it somewhere for the time being. 

We need to load in the Google Maps library at the top of our `index.html` file, like we would with any external JavaScript library. Inside the `head`, between the links to jQuery and your `app.js` file, add the following code, and replace `YOUR_API_KEY` with your actual API key that you just generated.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

Have a look at the last `<section>` tag. Inside we have a div with an id of "map". This is where we are going to load our Google Map. Let's add some CSS styles to the map so that we can see where the map should be showing. 

```
#location {
  #map {
    height: 300px;
    background-color: grey;
  }
}
```

Refresh the browser and you will see a grey box. This is where are going to load the map. To initialise the map we need to write some basic JavaScript, which has been modified from the code provided in the docs. 

```js
function initMap() {
  const lat = $('#map').data('lat');
  const lng = $('#map').data('lng');
  const latLng = { lat: lat, lng: lng };
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: latLng,
    scrollwheel: false
  });
  
  new google.maps.Marker({
    position: latLng,
    map: map
  });
}

initMap();
```

Add the following to the top of your `app.js` to stop the linter from giving the `google is not defined` error.

```
/* global google:true */
```

We could add the longitude and latitude of our pin directly into our JavaScript, but we could also print them in the HTML as data attributes and then grab them using jQuery. This might be useful if the data was coming from a database. 

Google requires us to create an object containing the longitude and latitude of where we want the map to center on. We can also then use the same object to say where we want our pin to drop.

There are other options we can pass in here to determine things like [styles](https://snazzymaps.com/) for the map (colours of roads, rivers etc.) or to add a [custom marker](https://developers.google.com/maps/documentation/javascript/custom-markers), but for now let's leave it like this. 

Refresh the page and check out your map!

### Responsive Design

There are a couple of additions we could make to our CSS to make out page a little more responsive. Add the following to add some space between the images on mobile, as well as the menu links when they start to stack.

```css
@media only screen and (max-width: 575px) {
  #gallery {
    .image {
      margin-bottom: 20px;
    }
  }

  #menus {
    a:not(:last-of-type) {
      margin-bottom: 5px;
    }
  }
}
```

Refresh and check out the changes by using the Chrome mobile simulator.

The final thing to do is to change the navigation to be a dropdown menu.

Change the HTML to be the following:

```html
<header>
  <nav class="container">
    <ul>
      <li class="menu">&#9776;</li>
      <div class="dropdown">
        <li><a href="#location">Location</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#menus">Menu</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#hero">Home</a></li>
      </div>
    </ul>
  </nav>
</header>
```

We now have a menu icon as an item in the navigation. Update the CSS to be:

```css
li {
  display: inline-block;
  float: right;
  margin-left: 20px;
  line-height: 40px;
  &:last-of-type {
    margin-left: 0;
  }
  &.menu {
    color: white;
    cursor: pointer;
    display: none;
    font-size: 20px;
  }
  
  ...
  
```

Here we are adding some styles to the menu icon, and hiding it. We can then show it in the media query as follows:

```css
@media only screen and (max-width: 575px) {
  header {
    height: auto;
    nav {
      ul {
        li {
          display: block;
          float: none;
          text-align: right;
          &.menu {
            display: block;
          }
        }
        .dropdown {
          display: none;
        }
      }
    }
  }

  ...
  
}
```

Here we are also hiding all of the lis that are inside the `.dropdown` div, so that we can then show them using JavaScript when we click on the menu icon. Let's add the JavaScript.

```js
const $menu = $('.menu');
$menu.on('click', toggleMenu);

function toggleMenu() {
  $('.dropdown').slideToggle();
}
```

Finally, when we are viewing the site on a mobile, and we click on a link and scroll to that section, it would be nice if the menu would slide up once the animation has finished. Update your 

```js
function scrollToSection() {
  const section = $(this).attr('href');
  $('body').animate( {
    scrollTop: $(section).offset().top
  }, 1000, () => {
    if ($window.width() < 575) {
      $('.dropdown').slideToggle();
    }
  });
}
```

Here we have added a callback function that will run once the scrolling animation has finished, which will check if we're on a mobile, and then slide the dropdown up.

### Conclusion

Hopefully you will see that making a slick single-page website isn't too hard, and a few lines of JavaScript can make your design go from good to great. There are a few CSS tricks here that will be useful for lots of projects, so feel free to copy, paste and modify as needed.