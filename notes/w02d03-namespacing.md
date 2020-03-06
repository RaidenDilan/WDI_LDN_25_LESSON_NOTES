# Namespacing

One of the problems with breaking up large functions and naming callback functions, is that we declare a lot of global variables and functions. This is a problem because the _pollute_ the `window` object.

Taking our Rock Paper Scissors game as an example, we have created the following global functions and variables:

- `setup`
- `findWinner`
- `makeSelection`
- `winConditions`
- `choices`

As our applications and programmes become more complex we will start to create more and more global variables. The more global variables we have, the more chance there is for us to overwrite variables and functions. This can easily lead to bugs causing our code to behave unexpectedly. This equates to lost hours and can become very expensive!

## Creating a single global object

To solve this problem, we can create one single global object to which we attach all of our global variables and functions.

If we name this global variable effectively, there is much less of a chance that it will be overwritten accidently.

Let's start by creating our object, and attatching the `choices` and `winConditions` to it:

```js
var rps = rps || {};

rps.choices = ['rock', 'paper', 'scissors'];
rps.winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};
```

On the first line, we are checking to see if a global variable `rps` already exists. If it does, we will use it, if not, we create a new one. This allows us to split our code over multiple files if we need to.

Notice we are using `var` here. This is because if we use `let` or `const` it will cause an error to be thrown.

We then attach our `choices` and `winConditions` to it.

If we run our code now we will get the following error:

```js
Uncaught ReferenceError: choices is not defined
	at makeSelection (app.js:12)
```

That is because `chioces` is no longer a global variable, it lives on the `rps` object. We can fix this by updating the `makeSelection` function like so:

```js
function makeSelection() {
  return rps.choices[Math.floor(Math.random() * rps.choices.length)];
};
```

And now, if we try it again:

```
Uncaught ReferenceError: winConditions is not defined
    at findWinner (app.js:16)
```

Oh dear, but that's ok, we can see by the error message that something similar has happened in our `findWinner` function. Let's update that as well:

```js
function findWinner(player1Choice, player2Choice) {
  if(rps.winConditions[player1Choice] === player2Choice) return 'Player 1 wins';
  if(rps.winConditions[player2Choice] === player1Choice) return 'Player 2 wins';
  return 'Tie';
}
```

Great, we're back in business!

Let's attach our functions to the `rps` object now:

```js
rps.makeSelection = function makeSelection() {
  return rps.choices[Math.floor(Math.random() * rps.choices.length)];
};

rps.findWinner = function findWinner(player1Choice, player2Choice) {
  .
  .
  .
};

rps.setup = function setup() {
  .
  .
  .
};
```

We'll also need to update the last line of the code:

```js
$(rps.setup);
```

Finally we need to update the `play` and `reset` functions, so that they work with our updates:

```js
function play(e) {
  const player1Choice = $(e.target).text();
  const player2Choice = rps.makeSelection();
  const winner = rps.findWinner(player1Choice, player2Choice);

  $player1.text(player1Choice);
  $player2.text(player2Choice);
  $result.text(winner);
};
```

Cool, now there are no more global variables!

## Using `this` to access our global variable

While the code we have is fine, and has done the important job of cleaning removing a lot of clutter from the `window` object, we can now reference our `rps` object using `this` from within our functions.

Let's update the `makeSelection`, `findWinner` and `setup` functions acordingly:

```js
rps.makeSelection = function makeSelection() {
  return this.choices[Math.floor(Math.random() * this.choices.length)];
};

rps.findWinner = function findWinner(player1Choice, player2Choice) {
  if(this.winConditions[player1Choice] === player2Choice) return 'Player 1 wins';
  if(this.winConditions[player2Choice] === player1Choice) return 'Player 2 wins';
  return 'Tie';
}

rps.setup = function setup() {
  .
  .
  .

  function play(e) {
    const player1Choice = $(e.target).text();
    const player2Choice = this.makeSelection();
    const winner = this.findWinner(player1Choice, player2Choice);

    $player1.text(player1Choice);
    $player2.text(player2Choice);
    $result.text(winner);
  };

  .
  .
  .
};
```

If we try to play our game now, we get the following error:

```js
Uncaught TypeError: this.makeSelection is not a function
    at HTMLButtonElement.play (app.js:30)
```

What went wrong?

If we log `this` inside our `setup` function, what are we expecting it to be? It feels like it should be `rps`, but it's not, it's `window`. Why is that?

## Being explicit

We are using jQuery's `document.ready` shorthand function and passing it a callback function. And remember **with callback functions `this` is always the window**.

We can fix this one of two ways. We could write a callback function that calls `rps.setup()`:

```js
$(() => rps.setup());
```

Alternatively we can use `.bind()` to **explicitly** set `this` to be `rps`:

```js
$(rps.setup.bind(rps));
```

Now when we run our code, we see that `this` inside our `setup` function is `rps`, which is what we want.

But now we get another error:

```js
Uncaught TypeError: this.makeSelection is not a function
    at HTMLButtonElement.play (app.js:31)
```

What happened this time?

The `play` function is also a callback! It's behaving just the same as the `setup` function. Let's fix that now. Let's use `.bind()` on our click event handlers

```js
$buttons.on('click', play.bind(this));
$reset.on('click', reset.bind(this));
```

Great!

## Tidying up

Now that we have moved everthing onto our global object, we can move our `play` and `reset` functions out of the `setup` function. This makes our `setup` function even more concise.

We'll also need to add the relevant variables created in the `setup` method to our global object:

```js
rps.play = function play(e) {
  const player1Choice = $(e.target).text();
  const player2Choice = this.makeSelection();
  const winner = this.findWinner(player1Choice, player2Choice);

  this.$player1.text(player1Choice);
  this.$player2.text(player2Choice);
  this.$result.text(winner);
};

rps.reset = function reset() {
  this.$player1.text('');
  this.$player2.text('');
  this.$result.text('');
};

rps.setup = function setup() {
  this.$player1 = $('.player1');
  this.$player2 = $('.player2');
  this.$result = $('.result');
  
  const $buttons = $('button.choice');
  const $reset = $('button.reset');

  $buttons.on('click', this.play.bind(this));
  $reset.on('click', this.reset.bind(this));
};
```

Boom! We're done!

## Conclusion

That may have seemed like a lot of work for very little pay off, but the namespacing pattern is used in the industry, so it is likely you will come across it in your careers.

While it is slightly overkill for such a simple application, understanding how to manipulate `this` with `bind` and how to structure you code in this way is very useful for a JavaScript developer.


