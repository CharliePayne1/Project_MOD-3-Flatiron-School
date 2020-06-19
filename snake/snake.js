document.addEventListener('DOMContentLoaded', () => {
// music.play();
})
const URL = `http://localhost:3000/users`

let player = JSON.parse(localStorage.getItem('player'));

const highScore = document.getElementById('high-score')
highScore.innerText = player.highscores.snake

const cvs = document.getElementById('snake');

const ctx = cvs.getContext('2d');

// creating imgs
const stage = new Image();
stage.src = 'snake_images/ground.png';

const apple = new Image();
apple.src = 'snake_images/food.png';

// create audios 
let appleSound = new Audio('sounds/eat.mp3');
let gameOver = new Audio('sounds/dead.mp3');
let music = new Audio('sounds/snake.mp3');


const BOX = 32;
let nextDirection;

// create the snake and food objects
let snake = [];

snake[0] = {
    x: 10 * BOX,
    y: 10 * BOX
}

let food = {
    x: Math.floor( Math.random() * 17 + 1 ) * BOX,
    y: Math.floor( Math.random() * 15 + 3 ) * BOX
}

function direction(e) {
    if (e.key === "ArrowLeft" && nextDirection != 'right') {
        nextDirection = "left"
    }
    if (e.key === "ArrowRight" && nextDirection != 'left') {
        nextDirection = "right"
    }
    if (e.key === "ArrowDown" && nextDirection != 'up') {
        nextDirection = "down"
    }
    if (e.key === "ArrowUp" && nextDirection != 'down') {
        nextDirection = "up"
    }
}

// create draw board game function
let score = 0;

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
       if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
           return true
       }
    }
    return false
}

const draw = () => {
    ctx.drawImage(stage, 0, 0);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0 )? 'black' : 'white'
        ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);

        ctx.strokeStyle = "dark green";
        ctx.strokeRect(snake[i].x, snake[i].y, BOX, BOX)
    }
    ctx.drawImage(apple, food.x, food.y);  
    
    // old head position
    // debugger
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (nextDirection === 'left') { snakeX -= BOX  }
    if (nextDirection === 'right') { snakeX += BOX   }
    if (nextDirection === 'up') {  snakeY -= BOX  }
    if (nextDirection === 'down') {  snakeY += BOX  }

    if (snakeX === food.x && snakeY === food.y) {
        appleSound.play();
        score ++;
        food = {
            x: Math.floor( Math.random() * 17 + 1 ) * BOX,
            y: Math.floor( Math.random() * 15 + 3 ) * BOX
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if (snakeX < BOX || snakeX > 17*BOX || snakeY < 3*BOX || snakeY > 17*BOX || collision(newHead, snake)) {
        finishGame();
    }

    snake.unshift(newHead)
    
    ctx.fillStyle = 'white';
    ctx.font = "45px Changa one"
    ctx.fillText(score, 2 * BOX, 1.6 * BOX)
}

const game = setInterval(draw, 150);

document.addEventListener('keydown', (e) => direction(e))

function finishGame() {
    gameOver.play();
    // createDivAlert();
    if (score > player.highscores.snake ) {
        player.highscores.snake = score;
        updateUserDatabase();
    }
    clearInterval(game);
}

function createNewGameButton() {
    const newGameButton =  document.createElement('button');
    newGameButton.id = "new-game";
    newGameButton.classList.add("btn", "btn-success");
    newGameButton.innerText = 'New Game'
    newGameButton.addEventListener('click', () => document.location.reload())

    return newGameButton
  }

  const createDivAlert = () => {
    const spanAlert = document.createElement('span');
    const divAlert = document.createElement('div');
    divAlert.classList.add('alert');
    divAlert.classList.add('alert-danger')
    divAlert.setAttribute("role", "alert");
    divAlert.innerText = `Game Over`;
    spanAlert.append(divAlert);
    const newGameButton = createNewGameButton();
    spanAlert.append(newGameButton)
    
    highScore.append(spanAlert);
  }
  
  function updateUserDatabase() {
    let object = { 
      highscores: player.highscores
    };
    debugger
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
      highScore.innerText = player.highscores.snake })
    .catch(error => console.log(error));
  }