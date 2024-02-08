// alert(
//   "Here is how to play this game : Movement => W,A,S,D and Move mouse for Rotation"
// );
//Declaration and Definition
let playerCanvas = document.getElementById("canvas");
playerCanvas.width = window.innerWidth;
playerCanvas.height = window.innerHeight;
playerCanvas.style.pointerEvents = "none";
playerCanvas.style.backgroundColor = "#2B2730";
playerCanvas.style.zIndex = "10";

let playerContext = canvas.getContext("2d");

let userName = document.getElementById("userName");
let leaderBoard = document.getElementById("leaderBoard");
let mainMenu = document.getElementById("menu");
let playBtn = document.getElementById("playBtn");
let restartBtn = document.getElementById("restart");
let gameOverDisplay = document.getElementById("GameOver");
let exitBtn = document.getElementById("exitBtn");
let exitBtn1 = document.getElementById("exitBtn1");
let table = document.querySelector("#popup table");

let uiGame = document.getElementById("gameUI");
let playerInfo = document.getElementById("playerData");
let playerNameElement = document.getElementById("playerName");
let healthElement = document.getElementById("health");
let healthBarFillElement = document.getElementById("healthBarFill");
window.addEventListener("resize", resizeCanvas);

const storedGameData = localStorage.getItem("gameData");
const gameDataFromLocalStorage = JSON.parse(storedGameData);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  playerCanvas.width = window.innerWidth;
  playerCanvas.height = window.innerHeight;
}

//Screen Center Point
let centerPointX = canvas.width / 2;
let centerPointY = canvas.height / 2;

//Mouse Position on the body
let mousePosX;
let mousePosY;
let angle;
let isMouseClicked = false;
let isPaused = false;

// 90 degrees in clockwise direction
const initialOffsetAngle = Math.PI / 2;

//Music
const bgMusic = new Audio();
const shootSound = new Audio();
const shipBoom = new Audio();

bgMusic.src = "./Music/bgSpace.mp3";
bgMusic.volume = 0.2;

shootSound.src = "./Music/shoot.wav";
shootSound.volume = 0.2;

const p = new Image();
p.src = "./img/me.png";

//Enemy
let enemyArr = [];

const score = new scoreBoard();
const bullet = new bulletController(score);
const player = new Player(bullet);
const particleController = new ParticleController();

//Creating Enemy
let i;
let enemyInterval = 1000;

function createEnemy() {
  if (isPaused) {
    return;
  }
  setInterval(() => {
    let enemy = new Enemy(player, bullet);
    enemyArr.push(enemy);

    if (enemyInterval > 700) {
      enemyInterval = enemyInterval - 4;
    } else {
      enemyInterval = 700;
    }

    if (score.minTime == 4) {
      enemyInterval -= 100;
    }
  }, enemyInterval);
}

let playerName;
// =-=-=-=-=-=-= Event Listeners =-=-=-=-=-=-=-=

playBtn.addEventListener("click", () => {
  playerName = userName.value;
  console.log(playerName);
  player.isAlive = true;
  mainMenu.style.display = "none";
  gameOverDisplay.style.display = "none";
  leaderBoard.style.display = "none";
  playerCanvas.style.display = "block";
  uiGame.style.display = "block";
  playerInfo.style.display = "block";
  // isGameRunning = true;
  gameLoop();
  createEnemy();
});
restartBtn.addEventListener("click", () => {
  console.log("Restart");
  restartGame();
});
exitBtn.addEventListener("click", () => {
  window.close();
});
exitBtn1.addEventListener("click", () => {
  window.close();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    isPaused = true;
    console.log("Tab or window is not visible");
  } else {
    isPaused = false;
    console.log("Tab or window is visible");
  }
});

document.body.addEventListener("click", (e) => {
  if (e.button == 0) {
    isMouseClicked = true;
    shootSound.play();
  }
});

document.body.addEventListener("mousemove", (e) => {
  mousePosX = parseInt(e.clientX);
  mousePosY = parseInt(e.clientY);
});

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

let gameLoopId = null;
let frameCount = 0;
let startTime = performance.now();

let lastTimestamp = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
  lastTimestamp = timestamp;
  updateGame(); //calling the update game function

  if (player.isAlive) {
    player.speed = 520 * deltaTime;
    player.enemySpeed =
      Math.floor(Math.random() * (300 - 150 + 1) + 150) * deltaTime;
    // player.enemySpeed = generateEnemySpeed() * deltaTime;

    gameLoopId = requestAnimationFrame(gameLoop);
  } else {
    cancelAnimationFrame(gameLoopId);
  }
}
let powerUpArray = [];

function updateGame() {
  let playerHealth = player.health;
  console.log(playerHealth);
  updatePlayerInfo(playerHealth, playerName);

  playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);

  if (player.isAlive) {
    bgMusic.play();
    bgMusic.loop = true;

    score.update();

    player.draw();

    bullet.draw();
    bullet.enemyCollision();

    spawnEnemy();
    particleController.updateParticles();

    for (let i = powerUpArray.length - 1; i >= 0; i--) {
      const powerUp = powerUpArray[i];
      powerUp.update();
      powerUp.draw(playerContext);

      if (powerUp.checkCollisionWithPlayer(player)) {
        console.log("Player picked up power up: ");
        handlePowerUpCollision(powerUp);
        powerUpArray.splice(i, 1);
      }

      if (!powerUp.isActive) {
        // Remove expired power-ups from the array
        powerUpArray.splice(i, 1);
      }
    }
  }

  if (!player.isAlive) {
    gameOverDisplay.style.display = "block";
    gameOverDisplay.style.zIndex = "11";

    isBoosted = false;
    isHoldToFire = false;
    allowHoldToFire = false;
    score.update();
    bgMusic.pause();
    score.stopTimer();
  }
}

function updatePlayerInfo(playerHealth, playerName) {
  playerNameElement.textContent = playerName;
  healthBarFillElement.style.width = playerHealth + "%";
  // Change color based on health
  if (playerHealth < 40) {
    healthBarFillElement.style.backgroundColor = "red";
  } else {
    healthBarFillElement.style.backgroundColor = "#0f0"; // Green color for healthy
  }
}

let isBoosted = false;
let isHoldToFire = false;
let allowHoldToFire = false;
const boostDuration = 20000; // 20 seconds
function handlePowerUpCollision(powerUp) {
  switch (powerUp.type) {
    case 1:
      if (!isBoosted) {
        isBoosted = true;
        const addedDamage = 70;
        //20sec
        player.bulletDamage += addedDamage;

        console.log("Player picked up : " + powerUp.type + " Damage Boost");
        console.log("Bullet damage = " + player.bulletDamage);

        // Reset bullet damage after boost duration
        setTimeout(() => {
          player.bulletDamage -= addedDamage;
          isBoosted = false;
          console.log("Damage Boost expired");
          console.log("Bullet damage = " + player.bulletDamage);
        }, boostDuration);
      }
      break;

    case 2:
      isHoldToFire = true;
      setTimeout(() => {
        isHoldToFire = false;
        allowHoldToFire = false;
      }, boostDuration);
      break;

    case 3:
      const addedHealth = 25;
      if (player.health < 250) {
        player.health += addedHealth;
        // console.log("Player picked up : " + powerUp.type + "Increase Health");
        // console.log("PLayer Health = " + player.health);
      }
      if (player.health > 250) {
        player.health = 250;
      }
      break;
    case 4:
      if (!player.isShieldOn) {
        player.isShieldOn = true;
        player.shieldHealth = 100;
      }
      // console.log("Player picked up : " + powerUp.type + "Shield");
      break;
    default:
      // Handle default case
      // console.log("Player picked up : " + powerUp.type + "Inc Health");
      break;
  }
}

function spawnEnemy() {
  for (let i = 0; i < enemyArr.length; i++) {
    enemyArr[i].update();
  }
}

function restartGame() {
  player.isAlive = true;
  player.health = 100;
  score.incScore = 0;
  score.hourTime = 0;
  score.minTime = 0;
  score.secTime = 0;

  isBoosted = false;
  isHoldToFire = false;
  isShieldOn = false;

  enemyArr = [];
  enemyInterval = 1000;

  // Clear all previous intervals
  for (let i = 1; i < 1000; i++) {
    window.clearInterval(i);
  }
  player.position.posX = centerPointX;
  player.position.posY = centerPointY;

  gameOverDisplay.style.display = "none";
  gameOverDisplay.style.zIndex = "-1";

  gameLoopId = requestAnimationFrame(gameLoop);
  // gameLoop(timestamp);
  createEnemy();
}

document.body.addEventListener("mousedown", (e) => {
  if (e.button == 0 && isHoldToFire) {
    allowHoldToFire = true;
    shootSound.play(); // Optionally, play a shooting sound when hold-to-fire starts
  }
});

document.body.addEventListener("mouseup", () => {
  allowHoldToFire = false; // Stop firing when mouse button is released
});

// PopUp
// Function to open the popup
function openPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
}

// Function to close the popup
function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}
