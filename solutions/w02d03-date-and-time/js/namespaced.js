var dtl = dtl || {};

dtl.padNum = function(num) {
  return num < 10 ? `0${num}` : num.toString();
};

dtl.currentTime = function currentTime() {
  const now = new Date();
  const hrs = this.padNum(now.getHours());
  const mins = this.padNum(now.getMinutes());
  const secs = this.padNum(now.getSeconds());

  return `${hrs}:${mins}:${secs}`;
};

dtl.startClock = function startClock() {
  this.$watchScreen.text(this.currentTime());
  setInterval(() => this.$watchScreen.text(this.currentTime()), 1000);
};

dtl.timeRemaining = 10;
dtl.timerIsRunning = false;

dtl.startStopTimer = function startStopTimer() {
  if(this.timerIsRunning) {
    this.timerIsRunning = false;
    return clearInterval(this.timerId);
  }

  this.timerIsRunning = true;
  dtl.timerId = setInterval(() => {
    this.timeRemaining--;
    if(this.timeRemaining === 0) {
      clearInterval(this.timerId);
      this.$timer.addClass('ringing');
    }
    this.$timerScreen.text(this.padNum(this.timeRemaining));
  }, 1000);
};

dtl.resetTimer = function resetTimer() {
  this.$timer.removeClass('ringing');
  this.timerIsRunning = false;
  clearInterval(this.timerId);
  this.timeRemaining = 10;
  this.$timerScreen.text(this.timeRemaining);
};

dtl.setup = function setup() {
  this.$watch = $('#watch');
  this.$watchScreen = this.$watch.find('.screen');
  this.startClock();

  this.$timer = $('#timer');
  this.$timerScreen = this.$timer.find('.screen');
  this.$startStopBtn = this.$timer.find('#startStop');
  this.$resetBtn = this.$timer.find('#reset');

  this.$startStopBtn.on('click', this.startStopTimer.bind(this));
  this.$resetBtn.on('click', this.resetTimer.bind(this));
};

$(dtl.setup.bind(dtl));
