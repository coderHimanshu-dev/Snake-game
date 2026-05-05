const board = document.querySelector(".board");
const startBtn = document.querySelector(".start-btn");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00-00`;

highScoreElement.textContent = highScore;
const blockHeight = 30;
const blockWeight = 30;

const blocks = [];
let intervalId = null;
let timeId = null;

let direction = "right";

const cols = Math.floor(board.clientWidth / blockWeight);
const rows = Math.floor(board.clientHeight / blockHeight);

let snake = [
  {
    x: 1,
    y: 3,
  },
];

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("blocks");
    board.appendChild(block);
    blocks[`${i} - ${j}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x} - ${food.y}`].classList.add("food");

  if (direction == "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction == "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";
    return;
  }

  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x} - ${food.y}`].classList.add("food");
    snake.unshift(head);
    score += 10;
    scoreElement.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highscore", highScore);
    }
  }
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
  });
}

startBtn.addEventListener("click", () => {
  intervalId = setInterval(() => {
    modal.style.display = "none";
    render();
  }, 200);
  timeId = setInterval(() => {
    let [minutes, second] = time.split("-").map(Number);

    if (second == 59) {
      minutes += 1;
      second = 0;
    } else {
      second += 1;
    }
    time = `${minutes} - ${second}`;
    timeElement.textContent = time;
  }, 1000);
});

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x} - ${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
  });
  score = 0;
  time = `00-00`;

  scoreElement.textContent = score;
  highScoreElement.textContent = highScore;
  timeElement.textContent = time;

  modal.style.display = "none";
  direction = "down";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {
    render();
  }, 200);
}
addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    direction = "up";
  } else if (e.key == "ArrowDown") {
    direction = "down";
  } else if (e.key == "ArrowLeft") {
    direction = "left";
  } else if (e.key == "ArrowRight") {
    direction = "right";
  }
});
