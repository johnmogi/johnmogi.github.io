'use strict';

const randomTwenty = () => {
  return Math.trunc(Math.random() * 20 + 1);
};
let secretNumber = randomTwenty();
console.log(secretNumber);
let score = 20;
let highScore = 0;

// refractor queryselectors
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};
const displayNumber = function (num) {
  document.querySelector('.number').textContent = num;
};
const displayScore = function (score) {
  document.querySelector('.score').textContent = score;
};

document.querySelector('.again').addEventListener('click', () => {
  score = 20;
  secretNumber = randomTwenty();
  console.log(secretNumber);
  displayMessage('התחילו בניחוש ...');
  displayNumber('?');
  displayScore(score);
  document.querySelector('.guess').value = '';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('body').style.backgroundColor = '#222';
});

document.querySelector('.check').addEventListener('click', () => {
  const guess = +document.querySelector('.guess').value;

  // When there is no input
  if (!guess) {
    displayMessage('⛔ אין מספר!');
  } else if (score === 0) {
    displayScore(0);
  }

  // when player wins
  else if (guess === secretNumber) {
    displayMessage('🤟 המספר נכון!');
    displayNumber(secretNumber);
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highScore) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }

    // when guess is wrong
  } else if (guess !== secretNumber) {
    displayMessage(guess > secretNumber ? '📈 גבוה מדי!' : '📉 נמוך מדי!');
    score--;

    if (score === 0) {
      displayMessage('💥 הפסדתם במשחק!');
      displayScore(0);
    }
  }

  displayScore(score);
});
