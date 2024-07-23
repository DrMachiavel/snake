const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const slowButton = document.getElementById("slowButton");
const normalButton = document.getElementById("normalButton");
const fastButton = document.getElementById("fastButton");
const overlay = document.getElementById("overlay");
const scoreDisplay = document.getElementById("scoreDisplay");
const highScoreMessage = document.getElementById("highScoreMessage");

let snake;
let fruit;
let score;
let direction;
let gameInterval;
let speed;
let level;
let highScore;
let highScore_1 = localStorage.getItem("highScore_1") || 0;
let highScore_2 = localStorage.getItem("highScore_2") || 0;
let highScore_3 = localStorage.getItem("highScore_3") || 0;

// Adjusted scale for larger segments
const scale = 30;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

//Levels & associated speeds
slowButton.addEventListener("click", () => startGame(150));
normalButton.addEventListener("click", () => startGame(100));
fastButton.addEventListener("click", () => startGame(50));

// Ajoutez cette méthode pour mettre à jour l'affichage des scores
function updateScoreDisplay() {
  scoreDisplay.innerText = `Score ${score} | Best ${highScore}`;
}

// Appelez cette méthode dans la fonction update
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fruit.draw();
  snake.update();
  snake.draw();

  // Mise à jour de l'affichage des scores
  updateScoreDisplay();

  if (snake.checkCollision()) {
    gameOver();
  }

  if (snake.eat(fruit)) {
    score += 5;
    fruit.pickLocation();
  }
}

function getHighScore(level) {
  return localStorage.getItem(`highScore_${level}`) || 0;
}

function setHighScore(level, score) {
  localStorage.setItem(`highScore_${level}`, score);
}

// Mettez à jour l'affichage des scores au début du jeu
function startGame(selectedSpeed) {
  speed = selectedSpeed;
  overlay.style.display = "none";
  highScoreMessage.innerText = ""; // Reset high score message
  score = 0;
  direction = "Right"; // Initial direction
  snake = new Snake();
  fruit = new Fruit();
  fruit.pickLocation();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, speed);
  updateScoreDisplay(); // Mise à jour de l'affichage des scores
  if (selectedSpeed === 150) {
    level = 1;
    highScore = highScore_1;
    console.log(highScore_1);
  }
  else if (selectedSpeed === 100) {
    level = 2;
    highScore = highScore_2;
  }
  else if (selectedSpeed === 50) {
    level = 3;
    highScore = highScore_3;
  }   
}

// Game Over - Update High Score
function gameOver() {
  clearInterval(gameInterval);
  overlay.style.display = "flex";

  if (score > highScore) {
    if (level === 1) {
      highScore = score;
      localStorage.setItem("highScore_1", highScore);
      highScoreMessage.innerText = "High Score!";
    } 
    else if (level === 2) {
      highScore = score;
      localStorage.setItem("highScore_2", highScore);
      highScoreMessage.innerText = "High Score!";
    } 
    else if (level === 3) {
      highScore = score;
      localStorage.setItem("highScore_3", highScore);
      highScoreMessage.innerText = "High Score!";
    }
    updateScoreDisplay(); // Mise à jour de l'affichage des scores
  } else {
    highScoreMessage.innerText = "Try again?";
    updateScoreDisplay(); // Mise à jour de l'affichage des scores
  }
}


// Check if direction is valid to avoid reversing
window.addEventListener("keydown", (e) => {
  let newDirection;
  let keyElement;

  switch (e.key) {
    case 'z':
    case 'Z':
      newDirection = 'Up';
      keyElement = document.getElementById('keyZ');
      break;
    case 's':
    case 'S':
      newDirection = 'Down';
      keyElement = document.getElementById('keyS');
      break;
    case 'q':
    case 'Q':
      newDirection = 'Left';
      keyElement = document.getElementById('keyQ');
      break;
    case 'd':
    case 'D':
      newDirection = 'Right';
      keyElement = document.getElementById('keyD');
      break;
    case 'ArrowUp':
      newDirection = 'Up';
      keyElement = document.getElementById('keyZ');
      break;
    case 'ArrowDown':
      newDirection = 'Down';
      keyElement = document.getElementById('keyS');
      break;
    case 'ArrowLeft':
      newDirection = 'Left';
      keyElement = document.getElementById('keyQ');
      break;
    case 'ArrowRight':
      newDirection = 'Right';
      keyElement = document.getElementById('keyD');
      break;
    default:
      return; // Ignore keys that are not used for movement
  }

  if (keyElement) {
    keyElement.classList.add('activeKey');
    setTimeout(() => {
      keyElement.classList.remove('activeKey');
    }, 200); // Change back after 200ms
  }

  if (isValidDirectionChange(newDirection)) {
    direction = newDirection;
  }
});

// Check if direction is valid to avoid reversing
function isValidDirectionChange(newDirection) {
  if (direction === "Up" && newDirection === "Down") return false;
  if (direction === "Down" && newDirection === "Up") return false;
  if (direction === "Left" && newDirection === "Right") return false;
  if (direction === "Right" && newDirection === "Left") return false;
  return true;
}

canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  let newDirection;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      newDirection = "Left";
    } else {
      newDirection = "Right";
    }
  } else {
    if (yDiff > 0) {
      newDirection = "Up";
    } else {
      newDirection = "Down";
    }
  }

  if (isValidDirectionChange(newDirection)) {
    direction = newDirection;
  }

  xDown = null;
  yDown = null;
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale * 1;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.draw = function () {
    ctx.fillStyle = "#FFD78B";
    for (let i = 0; i < this.tail.length; i++) {
      drawRoundedRect(this.tail[i].x, this.tail[i].y, scale, scale, 5);
    }
    drawRoundedRect(this.x, this.y, scale, scale, 5);
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.total - 1] = { x: this.x, y: this.y };

    if (direction === "Up") {
      this.ySpeed = -scale * 1;
      this.xSpeed = 0;
    } else if (direction === "Down") {
      this.ySpeed = scale * 1;
      this.xSpeed = 0;
    } else if (direction === "Left") {
      this.xSpeed = -scale * 1;
      this.ySpeed = 0;
    } else if (direction === "Right") {
      this.xSpeed = scale * 1;
      this.ySpeed = 0;
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width || this.y >= canvas.height || this.x < 0 || this.y < 0) {
      gameOver();
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        return true;
      }
    }
    return false;
  };
}

function Fruit() {
  this.x;
  this.y;

  this.pickLocation = function () {
    this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
  };

  this.draw = function () {
    const gradient = ctx.createRadialGradient(this.x + scale / 2, this.y + scale / 2, scale / 4, this.x + scale / 2, this.y + scale / 2, scale / 2);
    gradient.addColorStop(0, '#4cafab');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x + scale / 2, this.y + scale / 2, scale / 2, 0, 2 * Math.PI);
    ctx.fill();
  };
}


function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}