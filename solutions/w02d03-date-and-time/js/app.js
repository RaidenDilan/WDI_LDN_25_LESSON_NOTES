$(() => {
  // WATCH
  const $watch = $('#watch');
  const $watchScreen = $watch.find('.screen');

  function padNum(num) {
    return num < 10 ? `0${num}` : num;
  }

  function currentTime() {
    // return the current time in the correct format (HH:MM:SS)
    const now = new Date();
    const hrs = padNum(now.getHours());
    const mins = padNum(now.getMinutes());
    const secs = padNum(now.getSeconds());

    return `${hrs}:${mins}:${secs}`;
  }

  function startClock() {
    // display the current time on the clock screen
    // update the current time every second
    $watchScreen.text(currentTime());
    setInterval(() => $watchScreen.text(currentTime()), 1000);
  }

  startClock();

  // TIMER
  const $timer = $('#timer');
  const $timerScreen = $timer.find('.screen');
  const $startStopBtn = $timer.find('#startStop');
  const $resetBtn = $timer.find('#reset');

  // add event listeners to $startStopBtn & $resetBtn

  let timeRemaining = 10;
  let timerIsRunning = false;
  let timerId = null;

  function startStopTimer() {
    // stop the timer if it is running
    if(timerIsRunning) {
      clearInterval(timerId);
      timerIsRunning = false;
    } else {
      // start the timer if it is NOT running
      timerId = setInterval(() => {
        timeRemaining--;
        $timerScreen.text(timeRemaining);

        if(timeRemaining === 0) {
          clearInterval(timerId);
          $timer.addClass('ringing');
        }
      }, 1000);
      timerIsRunning = true;
    }
    // add "ringing" class to timer when time reaches 0
  }

  $startStopBtn.on('click', startStopTimer);

  function resetTimer() {
    // stop the timer
    clearInterval(timerId);
    // remove the "ringing" class
    $timer.removeClass('ringing');
    // reset the timeRemaining
    timeRemaining = 10;
    $timerScreen.text(timeRemaining);
    timerIsRunning = false;
  }

  $resetBtn.on('click', resetTimer);
});
