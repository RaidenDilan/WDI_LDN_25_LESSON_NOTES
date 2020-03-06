var fundRaiser = fundRaiser || {};

fundRaiser.updateProgressBar = function updateProgressBar(e) {
  if (this.progress.value >= 100) return false;
  const newValue = this.progress.value + parseFloat(e.target.value);

  if (100 - newValue < 10) this.buttons[2].disabled = true;
  if (100 - newValue < 5) this.buttons[1].disabled = true;
  if (100 - newValue < 1) {
    this.buttons[0].disabled = true;
    this.message.innerHTML = 'Congratulations! You have reached your target!';
  }

  this.progress.value = newValue;
  this.amount.textContent = 100 - newValue;
};

fundRaiser.setup = function setup() {
  this.progress = document.querySelector('progress');
  this.buttons  = document.querySelectorAll('button');
  this.amount   = document.querySelector('.amount');
  this.message  = document.querySelector('.message');

  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].onclick = this.updateProgressBar.bind(this);
  }

  // initial animation
  setTimeout(() => (this.progress.value = 43), 250);
};

document.addEventListener('DOMContentLoaded', fundRaiser.setup.bind(fundRaiser));
