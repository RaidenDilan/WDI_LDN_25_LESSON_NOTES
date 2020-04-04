window.addEventListener('DOMContentLoaded', () => {
  const names = [
    'Work It',
    'Harder',
    'Make It',
    'Better',
    'Do It',
    'Faster',
    'Makes Us',
    'Stronger',
    'More Than',
    'Ever',
    'Hour',
    'After',
    'Our',
    'Work Is',
    'Never',
    'Over',
    'Replay'
  ];
  const sounds = [
    'work_it.wav',
    'harder.wav',
    'make_it.wav',
    'better.wav',
    'do_it.wav',
    'faster.wav',
    'makes_us.wav',
    'stronger.wav',
    'more_than.wav',
    'ever.wav',
    'hour.wav',
    'after.wav',
    'our.wav',
    'work_is.wav',
    'never.wav',
    'over.wav'
  ];
  const playground = document.getElementsByTagName('main')[0];
  const audio = document.getElementsByClassName('audio');
  const lastPtag = document.getElementsByClassName('morphing');

  function createButtons() {
    for (var i = 0; i < 16; i++) {
      let index = i;
      const buttons = document.createElement('div');

      buttons.innerHTML = `<audio src="sounds/${sounds[i]}" class="audio"></audio><p id="${index}">${names[i]}</p>`;
      buttons.style = 'border: 1px solid rgb(21, 21, 22); display: inline-block; padding: 10px; width: 21%;height: 100px;margin: 0.5%;position: relative; transition: background-color .2s';
      buttons.addEventListener('click', () => audio[index].play());

      playground.appendChild(buttons);

      const text = document.getElementById(index);

      index < 4
        ? text.style = 'color: red;'
        : index < 8
          ? text.style = 'color: orange;'
          : index < 12
            ? text.style = 'color: yellow;'
            : text.style = 'color: magenta';
    }
  }

  function playAll() {
    const playAllButton = document.createElement('div');

    playAllButton.innerHTML = '<audio src="sounds/harder.wav"></audio><p class="morphing" style="color: white; font-size: 24px">Press for MAGIC</p>';
    playAllButton.style = 'border: 1px solid rgb(21, 21, 22); display: block; height: 100px; margin: 5px auto 20px; width: 215px; padding: 3px 6px;';
    playground.appendChild(playAllButton);
    playAllButton.addEventListener('click', () => playSoundINFINITELY());
  }

  function playSoundINFINITELY() {
    let i = 0;

    const dOIT = setInterval(() => {
      (i < 4)
        ? lastPtag[0].style = 'color: red; font-size: 22px;'
        : (i < 8)
          ? lastPtag[0].style = 'color: orange;font-size: 21px;'
          : (i < 12)
            ? lastPtag[0].style = 'color: yellow;font-size: 22px;'
            : (i < 16)
              ? lastPtag[0].style = 'color: magenta;font-size: 23px;'
              : (lastPtag[0].style = 'color: white; font-size: 24px;', clearInterval(dOIT));

      lastPtag[0].textContent = names[i];

      (audio[i] !== undefined) && audio[i].play();
      i++;
    }, 510);
    dOIT;
  }

  createButtons();
  playAll();
});
