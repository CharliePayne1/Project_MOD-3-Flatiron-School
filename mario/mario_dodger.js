import { player } from '../home.js';

console.log(player);

// const
let rock = document.getElementById('rock');
let dodger = document.getElementById('dodger');
let userScoreSpan = document.getElementById('user-score');
const header = document.getElementById('title');
const newGame = document.querySelector("#new-game");
const body = document.getElementById('body');
const startMarioGame = document.getElementById('start-mario');
const stopMarioGame = document.getElementById('stop-mario');
const highScore = document.getElementById('high-score');

let startAudio = new Audio("./sounds/mario-music.mp3");
let loseAudio = new Audio("./sounds/lose_sound.wav");

startMarioGame.addEventListener('click', () => startGame());



// make rock fall
let randomCoordinate = () => Math.floor((Math.random()*(600-rockWidth)))

const startGame = () => {
  debugger
  startAudio.play();
  userScoreSpan.innerText = 0
  const timeUp = window.setInterval(() => {userScoreSpan.innerText ++}, 1000);

  let top = 0
  let speed = 1
  const intervalId = setInterval(() => speed += 0.5, 4000)

  const prepareNextAnimation = () => {
    if ( top >= 360 ) {
      top = 0
      rock.style.left = `${randomCoordinate()}px`
    }
    rock.style.top = `${top += speed}px`
    if ( !collision() ) {
      requestAnimationFrame( prepareNextAnimation )
    } else {
      finishGame(intervalId, timeUp, userScoreSpan)
    }
  }
  requestAnimationFrame( prepareNextAnimation )
}

document.addEventListener('keydown', e => {
  if (e.key === "ArrowLeft") { moveDodgerLeft() }
  if (e.key === "ArrowRight") { moveDodgerRight() }
})
// move dodger left 
const moveDodgerLeft = () => {
  let leftNumbers = dodger.style.left.replace("px", "");
  let left = parseInt(leftNumbers, 10);
  if (left > 0) { dodger.style.left = `${left - 5}px` }
}
// move dodger right
const moveDodgerRight = () => {
  let leftNumbers = dodger.style.left.replace("px", "");
  let left = parseInt(leftNumbers, 10);
  if (left < (600-dodgerWidth)) { dodger.style.left = `${left + 5}px` }
}

// conditions for GAME OVER
let dodgerWidth = dodger.offsetWidth;
let dodgerHeight = dodger.offsetHeight;
let rockWidth = rock.offsetWidth;
let rockHeight = rock.offsetHeight;

const collision = () => {
  let rockRight = (rock.offsetLeft + rockWidth);
  let dodgerRight = (dodger.offsetLeft + dodgerWidth);
  let limit = 401 - (rockHeight + dodgerHeight)

  if (rock.offsetTop >= limit) {
    if (rock.offsetLeft <= dodger.offsetLeft && rockRight >= dodger.offsetLeft ||
      rock.offsetLeft >= dodger.offsetLeft && rockRight <= dodgerRight ||
      rock.offsetLeft <= dodgerRight && rockRight >= dodgerRight) {
        startAudio.pause();
        loseAudio.play();
      return true
    }
  }
  return false
}

function createNewGameButton() {
  const newGameButton =  document.createElement('button');
  newGameButton.id = "new-game";
  newGameButton.classList.add("btn", "btn-success");
  newGameButton.innerText = 'New Game'
  return newGameButton
}

const createDivAlert = () => {
  const spanAlert = document.createElement('span');
  const divAlert = document.createElement('div');
  divAlert.classList.add('alert');
  divAlert.classList.add('alert-danger')
  divAlert.setAttribute("role", "alert");
  divAlert.innerText = `You got crushed by the rock. Game Over!`;
  spanAlert.append(divAlert);
  const newGameButton = createNewGameButton();
  spanAlert.append(newGameButton)

  newGameButton.addEventListener('click', () => document.location.reload())
  
  header.append(spanAlert);
}

const finishGame = (intervalId, timeUp, userScoreSpan) => {
  if (userScoreSpan.innerText > highScore.innerText) { highScore.innerText = userScoreSpan.innerText}
  createDivAlert();
  clearInterval(intervalId)
  clearInterval(timeUp);
}

