$(() => {
  const $display = $('.display');
  const $timer = $('.timer');
  const $button = $('button');
  const $submit = $('input[type="submit"]');
  const $input = $('input[type="text"]');
  const $feedback = $('.feedback');
  const $hidden = $('.hidden');
  const $score = $('.score');
  let userScore = 0;
  let time = 10;
  let computerAnswer = null;

  $button.on('click', startTimer);
  $submit.on('click', checkForMatch);

  $(document).on('keydown', (event) => {
    var keyboardKey = event.keyCode;

    // TODO: should only run when input is in focus
    switch(keyboardKey) {
      case 13:
        checkForMatch();
        break;
    }
  });

  function checkForMatch() {
    const userAnswer = parseFloat($input.val());
    if (computerAnswer === userAnswer) {
      $feedback.html('It\'s a match!');
      userScore++;
    } else {
      $feedback.html('Incorrect!');
      userScore--;
    }
    $score.html(userScore);
    generateSum();
  }

  function startTimer() {
    resetGame();
    toggleBoard();
    generateSum();
    $timer.addClass('active');

    const timerId = setInterval(() => {
      time--;
      $timer.html(time);
    }, 1000);

    setTimeout(() => {
      clearInterval(timerId);
      $display.html('Stop!');
      $button.html('Play again?');
      toggleBoard();
    }, 10000); // stop timer after 10 seconds
  }

  function generateSum() {
    $input.val('');
    const first = Math.ceil(Math.random() * 10);
    const second = Math.ceil(Math.random() * 10);
    $display.html(`${first} + ${second} = ?`);
    computerAnswer = first + second;
  }

  function resetGame() {
    userScore = 0;
    time = 10;
    $score.html(userScore);
    $timer.html(time);
    $feedback.html('');
    $timer.removeClass('active');
  }

  function toggleBoard() {
    $hidden.toggle();
    $button.toggle();
  }

});
