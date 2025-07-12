const morseDisplay = document.getElementById('morse');
const textDisplay = document.getElementById('text');
const telegraphSound = document.getElementById('telegraphSound');

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

let pressStart, currentMorse = '', morseSequence = [], textResult = '';
let pressTimeout, wordTimeout;

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !pressStart) {
    telegraphSound.currentTime = 0;
    telegraphSound.play();
    e.preventDefault();
    pressStart = new Date().getTime();
    clearTimeout(pressTimeout);
    clearTimeout(wordTimeout);
  }
});

document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    const pressDuration = new Date().getTime() - pressStart;
    pressStart = null;

    currentMorse += pressDuration < 300 ? '.' : '-';
    morseDisplay.textContent = morseSequence.join(' ') + ' ' + currentMorse;

    pressTimeout = setTimeout(() => {
      morseSequence.push(currentMorse);
      const letter = morseMap[currentMorse] || '?';
      textResult += letter;
      textDisplay.textContent = textResult;
      currentMorse = '';
    }, 500);

    wordTimeout = setTimeout(() => {
      textResult += ' ';
      textDisplay.textContent = textResult;
    }, 1000);
  }
});
