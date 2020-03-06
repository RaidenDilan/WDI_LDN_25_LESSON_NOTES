var game = game || {};

game.setup = function setup() {
  this.$display = $('.display');
  this.$timer = $('.timer');
  this.$button = $('button');
  this.$submit = $('input[type="submit"]');
  this.$input = $('input[type="text"]');
  this.$feedback = $('.feedback');
  this.$hidden = $('.hidden');
  this.$score = $('.score');
  this.userScore = 0;
  this.time = 10;
  this.computerAnswer = null;

  this.$button.on('click', this.startTimer.bind(this));
  this.$submit.on('click', this.checkForMatch.bind(this));
  $(document).on('keydown', this.enterKeydown.bind(this));
};

game.checkForMatch = function checkForMatch() {
  const userAnswer = parseFloat(this.$input.val());
  if (this.computerAnswer === userAnswer) {
    this.$feedback.html('It\'s a match!');
    this.userScore++;
  } else {
    this.$feedback.html('Incorrect!');
    this.userScore--;
  }
  this.$score.html(this.userScore);
  this.generateSum();
};

game.resetGame = function resetGame() {
  this.userScore = 0;
  this.time = 10;
  this.$score.html(this.userScore);
  this.$timer.html(this.time);
  this.$feedback.html('');
  this.$timer.removeClass('active');
};

game.startTimer = function startTimer() {
  this.resetGame();
  this.toggleBoard();
  this.generateSum();
  this.$timer.addClass('active');

  const timerId = setInterval(() => {
    this.time--;
    this.$timer.html(this.time);
  }, 1000);

  setTimeout(() => {
    clearInterval(timerId);
    this.$display.html('Stop!');
    this.$button.html('Play again?');
    this.toggleBoard();
  }, (this.time * 1000));
};

game.toggleBoard = function toggleBoard() {
  this.$hidden.toggle();
  this.$button.toggle();
};

game.enterKeydown = function enterKeydown(event) {
  this.keyboardKey = event.keyCode;
  console.log('event.keyCode', event.keyCode);
  console.log('$(event.keyCode)', $(event.keyCode));
  // TODO: should only run when input is in focus
  switch(this.keyboardKey) {
    case 13:
      this.checkForMatch();
      break;
  }
};

game.generateSum = function generateSum() {
  this.$input.val('');
  const first = Math.ceil(Math.random() * 10);
  const second = Math.ceil(Math.random() * 10);
  this.$display.html(`${first} + ${second} = ?`);
  this.computerAnswer = first + second;
};

$(() => game.setup());
