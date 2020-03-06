

# HTML5 Audio

### Objectives
*After this lesson, students will be able to:*

- Play sounds using the HTML5 audio tag
- Use HTML5 DOM methods to play audio
- Understand the difference between HTML5 and older versions of HTML

### Preparation
*Before this lesson, students should already be able to:*

- Write basic HTML
- Create functions in Javascript


## HTML5 - Intro (5 mins)

HTML5 was standardised on 28 October 2014 by the World Wide Web Consortium (W3C). The previous version of HTML, HTML4, was standardised in 1997. In the 17 years between these two versions, obviously there where lots of changes both in technology and web-usage.

HTML5 has lots of improvements over HTML4, one being that it was designed with low-powered devices such as smartphones and tablets in mind.

HTML5 also adds a number of syntactic improvements, including new media elements:

- `video`
- `audio`
- `canvas`

And new semantic tags:

- `<main>`
- `<section>`
- `<article>`
- `<header>`
- `<footer>`
- `<aside>`
- `<nav>`
- `<figure>`

In this lesson we are going to look specifically at the HTML5 audio tag and how we might use it both in HTML and programatically with JavaScript.

## HTML5 Audio - Codealong (15 mins) 

The HTML `<audio` tag is used to play one or more audio sources in a document. You can also use the Web Audio API to directly generate and manipulate audio streams from JavaScript code. However, this is a little more complicated and requires more code.

Let's start by creating a basic HTML document:

```bash
$ touch index.html
$ atom .
```

Then once inside, let's use the autocomplete to populate this page with a HTML boilerplate (`html` then `tab`). Once you have that, give the page a title.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Intro to HTML5 APIs</title>
</head>
<body>

</body>
</html>
```

### No controls

The first `audio` tag we are going to look at just going to autoplay a sound, with no controls.

```html
<!-- Simple audio playback -->
<audio src="http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3" autoplay>
  Your browser does not support the <code>audio</code> element.
</audio>
```

In this example, we are just using an mp3 file found on the web.

There are a number of audio types that the player can work with:

| File Format | Media Type | 
|---|---|
| MP3 | audio/mpeg |
| Ogg | audio/ogg | 
| Wav | audio/wav |

We have also added the optional `autoplay` attribute:

> A Boolean attribute; if specified (even if the value is "false"!), the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.

If you refresh the page, you should hear the sound!

Some of the other possible attributes are:

| Attribute | Value | Description |  
|---|---|---|
| `autoplay` | autoplay | Specifies that the audio will start playing as soon as it is ready |
| `controls` | controls | Specifies that audio controls should be displayed (such as a play/pause button etc) |
| `loop` | loop | Specifies that the audio will start over again, every time it is finished |
| `muted` | muted | Specifies that the audio output should be muted |
| `preload` | auto, metadata, none | Specifies if and how the author thinks the audio should be loaded when the page loads |
| `src` | URL | Specifies the URL of the audio file |

### With controls

Now let's comment out that example, so that the sound doesn't automatically play.

Next, let's add an `audio` tag with controls:

```html
<!-- Audio playback with controls -->
<audio controls="controls">
  Your browser does not support the <code>audio</code> element.
  <source src="http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3" type="audio/mp3">
</audio>
```

If you refresh the page you should see an audio player!


## Using Javascript - Codealong (15 mins)

The HTML5 DOM has methods, properties and events for the `audio` and `video` elements. These methods allow you to manipulate elements using JavaScript.

| Method | Description | 
|---|---|
| `addTextTrack()` | Adds a new text track to the audio/video |
| `canPlayType()` | Checks if the browser can play the specified audio/video type |
| `load()` | Re-loads the audio/video element |
| `play()` | Starts playing the audio/video |
| `pause()` | Pauses the currently playing audio/video |

**Note:** You can also increase the volume using the volume property.
		
These have a look at these DOM methods now.
		
First, let's create a JavaScript file and link to it in our `index.html` file:

```bash
$ touch app.js
```

Inside `index.html`:

```html
<script src="app.js"></script>
```

And let's add an empty `<audio>` element to the `<body>` of the HTML.

```html
<audio id="audio"></audio>
```

### Javascript

The first thing we need to do is to setup an `eventListener` for when the DOM has loaded.

```js
window.addEventListener("DOMContentLoaded", function(event) {

});
```

Next, we need to grab the audio tag from the HTML -

```js
window.addEventListener("DOMContentLoaded", function(event) {

  var audio = document.getElementById("audio");

});
```

Next, we want to add the `src` of an audio file:

```js
window.addEventListener("DOMContentLoaded", function(event) {

  var audio = document.getElementById("audio");
  audio.src = "http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3";

});
```

Finally, we want to use the DOM audio method `play()` to play the track:

```js
window.addEventListener("DOMContentLoaded", function(event) {

  var audio = document.getElementById("audio");
  audio.src = "http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3";
  audio.play();

});
```

If you load the page now, you should hear the sound playing!

## Independent Practise - (15 mins)

Now that we have a track playing. Let's try to push this a little further and add a play button. 

You should begin by writing some pseudo-code:

1. Add a play button HTML element
2. Add an eventListener to listen for the click of that button
3. Play the sound then that button has been clicked.

#### Bonus

Add a little bit of styling.

<img width="542" alt="screen shot 2016-01-22 at 13 51 50" src="https://cloud.githubusercontent.com/assets/40461/12512285/564c8b4c-c10f-11e5-8609-14fe2c60dc07.png">


### Web Audio API

We can also play audio using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). However, to do this with Vanilla JavaScript is quite a bit of work.

## Reference

- [Mozilla Documentation](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio)