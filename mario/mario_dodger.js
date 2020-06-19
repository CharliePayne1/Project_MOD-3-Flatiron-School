
// const
const URL = `http://localhost:3000/users`

let rock = document.getElementById('rock');
let dodger = document.getElementById('dodger');
const header = document.getElementById('title');
const newGame = document.querySelector("#new-game");
const body = document.getElementById('body');
const startMarioGame = document.getElementById('start-mario');
const stopMarioGame = document.getElementById('stop-mario');
let highScore = document.getElementById('high-score');
let userScoreSpan = document.getElementById('user-score');

let player = JSON.parse(localStorage.getItem('player'));

highScore.innerText = player.highscores.mario

let startAudio = new Audio("./sounds/mario-music.mp3");
let loseAudio = new Audio("./sounds/lose_sound.wav");

startMarioGame.addEventListener('click', () => startGame());


// make rock fall
let randomCoordinate = () => Math.floor((Math.random()*(600-rockWidth)))

const startGame = () => {
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
  divAlert.innerText = `Game Over!`;
  spanAlert.append(divAlert);
  const newGameButton = createNewGameButton();
  spanAlert.append(newGameButton)

  newGameButton.addEventListener('click', () => document.location.reload())
  
  userScoreSpan.append(spanAlert);
}

const finishGame = (intervalId, timeUp, userScoreSpan) => {
  if (userScoreSpan.innerText > highScore.innerText) { highScore.innerText = userScoreSpan.innerText}
  createDivAlert();
  clearInterval(intervalId)
  clearInterval(timeUp);
  if (userScoreSpan.innerText > player.highscores.mario ) { 
    player.highscores.mario = parseInt(userScoreSpan.innerText);
    updateUserDatabase(player, userScoreSpan);
  }
}

function updateUserDatabase(player) {
  // debugger
  let object = { 
    highscores: player.highscores
  };
  // debugger
  let configObject = {
  method: 'PATCH',
  headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
  },
  body: JSON.stringify(object)
  };
  
  fetch(`${URL}/${player.id}`, configObject)
  .then(resp => resp.json())
  .then(player => { 
    window.localStorage.setItem('player', JSON.stringify(player))
    highScore.innerText = player.highscores.mario })
  .catch(error => console.log(error));
}