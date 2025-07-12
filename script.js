const headingText = "Morse Code Terminal";
const heading = document.getElementById("heading");
let index = 0;

function typeWriter() {
  if (index < headingText.length) {
    heading.innerHTML += headingText.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();

const textDisplay = document.getElementById('textDisplay');
const morseDisplay = document.getElementById('morseDisplay');
const clearBtn = document.getElementById('clearBtn');
const dotSound = document.getElementById('dotSound');
const dashSound = document.getElementById('dashSound');

const morseMap = {
  ".-": "A", "-...": "B", "-.-.": "C", "-..": "D",
  ".": "E", "..-.": "F", "--.": "G", "....": "H",
  "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
  "--": "M", "-.": "N", "---": "O", ".--.": "P",
  "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
  "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
  "-.--": "Y", "--..": "Z",
  "-----": "0", ".----": "1", "..---": "2", "...--": "3",
  "....-": "4", ".....": "5", "-....": "6", "--...": "7",
  "---..": "8", "----.": "9"
};

let pressStart, currentMorse = '', textResult = '';
let pressTimeout, wordTimeout;

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !pressStart) {
    e.preventDefault();
    pressStart = new Date().getTime();
    clearTimeout(pressTimeout);
    clearTimeout(wordTimeout);
  }
});

document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    const duration = new Date().getTime() - pressStart;
    pressStart = null;

    if (duration < 300) {
      currentMorse += '.';
      dotSound.currentTime = 0;
      dotSound.play();
    } else {
      currentMorse += '-';
      dashSound.currentTime = 0;
      dashSound.play();
    }

    morseDisplay.textContent = "Morse: " + currentMorse;

    pressTimeout = setTimeout(() => {
      const letter = morseMap[currentMorse] || '?';
      textResult += letter;
      textDisplay.textContent = textResult;
      currentMorse = '';
      morseDisplay.textContent = '';
    }, 500);

    wordTimeout = setTimeout(() => {
      textResult += ' ';
      textDisplay.textContent = textResult;
    }, 1000);
  }
});

clearBtn.addEventListener('click', () => {
  currentMorse = '';
  textResult = '';
  textDisplay.textContent = '';
  morseDisplay.textContent = '';
});
