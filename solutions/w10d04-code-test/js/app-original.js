var FundRaiser = FundRaiser || {};

FundRaiser = {
  setup: () => {
    this.progress = document.querySelector('progress');
    this.buttons = document.querySelectorAll('button');
    this.amount = document.querySelector('.amount');
    this.message = document.querySelector('.message');

    for (let button in this.buttons) { // for (let i = 0; i < this.buttons.length; i++)
      this.buttons[button].onclick = FundRaiser.updateProgressBar.bind(FundRaiser);
    }
    // initial animation
    setTimeout(() => (this.progress.value = 43), 250);
  },
  updateProgressBar: (e) => {
    this.progress.value >= 100 && (!1);
    const newValue = this.progress.value + parseFloat(e.target.value);

    100 - newValue < 10 && (this.buttons[2].disabled = true);
    100 - newValue < 5 && (this.buttons[1].disabled = true);
    100 - newValue < 1 && (this.buttons[0].disabled = true, this.message.innerHTML = 'Congratulations! You have reached your target!');

    this.progress.value = newValue;
    this.amount.textContent = 100 - newValue;
  }
};

document.addEventListener('DOMContentLoaded', FundRaiser.setup.bind(FundRaiser));
