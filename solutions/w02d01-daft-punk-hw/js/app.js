console.log('okay');
window.addEventListener('DOMContentLoaded', () => {

  const names = ['Work It', 'Harder', 'Make It', 'Better', 'Do It', 'Faster', 'Makes Us', 'Stronger', 'More Than', 'Ever', 'Hour', 'After', 'Our', 'Work Is', 'Never', 'Over', 'Replay']; // create a constant object called names as an array of the song file names in a String. Which is for the Press for MAGIC button.
  const sounds = ['work_it.wav', 'harder.wav', 'make_it.wav', 'better.wav', 'do_it.wav', 'faster.wav', 'makes_us.wav', 'stronger.wav', 'more_than.wav', 'ever.wav', 'hour.wav', 'after.wav', 'our.wav', 'work_is.wav', 'never.wav', 'over.wav']; // create a constant object called sounds as an array of the song in a String with their exact file names.
  const playground = document.getElementsByTagName('main')[0]; // create a constant object called playground which gets the element by tag name method, with a String and graps the array [0].
  const audio = document.getElementsByClassName('audio'); // create a constant object called audio which gets the element by class name method, with a String.
  const lastPtag = document.getElementsByClassName('morphing'); // create a constant object called lastPtag which gets the element by tag name method, with a String.

  // 1. The first command is definition of variable i. We define variable i with value 0. That is value from which the loop starts. We usually use variable with name i (shortcut for iteration) - it is coding convention.
  // 2. The second command (i < 11) is condition. We check if i is lower than 11. The loop is running while this condition is true.
  // 3. In the last command (i++), we increment value of the i variable by 1. The value of variable i is incremented after each iteration of for loop.

  function createButtons() {
    for (var i = 0; i < 16; i++) {
      var index = i; // create a constant object called index and asign it to i.
      var buttons = document.createElement('div'); // create a constant objected called buttons and asign it to create an element to a String called div.
      buttons.innerHTML = `<audio src="sounds/${sounds[i]}" class="audio"></audio><p id="${index}">${names[i]}</p>`; // Call the buttons ojbect with write the .innerHTML within a String.
      buttons.style = 'border: 1px solid rgb(21, 21, 22); display: inline-block; padding: 10px; width: 21%;height: 100px;margin: 0.5%;position: relative; transition: background-color .2s'; // Call the buttons ojbect with .style to style with css written within a String.
      buttons.addEventListener('click', function() { // Call the buttons ojbect and a event handler to it when a click happens.
        audio[index].play();   // Call the audio ojbect and grab it's index and play them all.
      });
      // Call the playground object with an .appendChild method which appends a node as the last child of a node.
      playground.appendChild(buttons);
      // Call the constant object text and get it's element by id method with the parameter index
      const text = document.getElementById(index);
      // if the index parameter is less than 4.
      if (index < 4) {
        // calls the object to style the button tag to change color to red.
        text.style = 'color: red;';
        // if the 'if' stagement fails run another the next code and if the index parameter is less than 8.
      } else if (index < 8) {
        // calls the object to style the button tag to change color to orange.
        text.style = 'color: orange;';
        // if the 'else if' stagement fails again run another the next code and if the index parameter is less than 12.
      } else if (index < 12) {
        // calls the object to style the button tag to change color to yellow.
        text.style = 'color: yellow;';
        // if all the codes above fails return an 'else stagement' as the code to run.
      } else {
        // calls the object to style the button tag to change color to magenta.
        text.style = 'color: magenta';
      }
    }
  }

  // Crete a function callsed playAll.
  function playAll() {
    // create a constant object callsed playAllButton and create an element with the String of 'div'.
    const playAllButton = document.createElement('div');
    // Call the playAllButton object and change the innerHTML with the content inside a String
    playAllButton.innerHTML = '<audio src="sounds/harder.wav"></audio><p class="morphing" style="color: white; font-size: 24px">Press for MAGIC</p>';
    // calls the playAllButton ogject and change it's CSS wit the content inside a String.
    playAllButton.style = 'border: 1px solid rgb(21, 21, 22); display: block;height: 100px;margin: 5px auto 20px; width: 215px; padding: 3px 6px;';
    // calls the playground object with an .appendChild method of playAllButton which appends a node as the last child of a node.
    playground.appendChild(playAllButton);
    // calls the playAllButton ogject and listen for an event when the mouse is clicked.
    playAllButton.addEventListener('click', function() {
      // finally this calls the playSoundINFINITELY function to play all the audio files until.
      playSoundINFINITELY();
    });
  }

  // create a new function called playSoundINFINITELY.
  function playSoundINFINITELY() {
    // let i to be 0;
    let i = 0;
    // creates a new constant ogject and asigning a setIntervel to it which will change the color of the name of the audio in the Press for MAGIC button every 4, 8, 12, 16 audio names then it goes back to 0 which is a white color.
    const dOIT = setInterval(function(){
      //if i is less than 4
      if (i < 4) {
        // call the constant object lastPtag starting at the index of 0 and changing the CSS with the content in a String.
        lastPtag[0].style = 'color: red; font-size: 22px;';
        // if the 'if' statement fails then run if 'i' is than 8.
      } else if (i < 8) {
        // call the constant object lastPtag starting at the index of 0 and changing the CSS with the content in a String.
        lastPtag[0].style = 'color: orange;font-size: 21px;';
        // if the 'else if' statement fails then if 'i' is than 12.
      } else if (i < 12) {
        // call the constant object lastPtag starting at the index of 0 and changing the CSS with the content in a String.
        lastPtag[0].style = 'color: yellow;font-size: 22px;';
        // if the 'else if' statement fails then if 'i' is than 16.
      } else if (i < 16) {
        // call the constant object lastPtag starting at the index of 0 and changing the CSS with the content in a String.
        lastPtag[0].style = 'color: magenta;font-size: 23px;';
        // if all the above code fails then run the last code with an else statement.
      } else {
        // call the constant object lastPtag starting at the index of 0 and changing the CSS with the content in a String.
        lastPtag[0].style = 'color: white; font-size: 24px;';
        // after all the code in this function has run call the function clearInterval with the parameter 'dOIT' to finish the interval.
        clearInterval(dOIT);
      }

      // calls the constant lastPtag it gets the text content of the first array and asigns it with array of names[index].
      lastPtag[0].textContent = names[i];
      // calls the constant audio and plays through all of the array.
      audio[i].play();

      // i = i + 1. This increments the number after the expression is evaluated. add 1 to i, returns the old value.
      i++;
      // runs this function for 510 milliseconds.
    }, 510);
    // calls the constant object dOIT again which will run the function that changes the color of names in the Press for MAGIC button.
    dOIT;
  }

  // call the function createButtons.
  createButtons();
  // call the function playAll.
  playAll();
});
