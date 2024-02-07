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

let mainMenu = document.getElementById("menu");
let playBtn = document.getElementById("playBtn");
let restartBtn = document.getElementById("restart");
let gameOverDisplay = document.getElementById("GameOver");
let exitBtn = document.getElementById("exitBtn");
let exitBtn1 = document.getElementById("exitBtn1");
window.addEventListener("resize", resizeCanvas);

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

// =-=-=-=-=-=-= Event Listeners =-=-=-=-=-=-=-=

playBtn.addEventListener("click", () => {
  player.isAlive = true;
  mainMenu.style.display = "none";
  gameOverDisplay.style.display = "none";
  playerCanvas.style.display = "block";
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

// let baseEnemySpeed = 0;
// function increaseSpeed() {
//   baseEnemySpeed += 10;
// }
// setInterval(increaseSpeed, 4000);

// function generateEnemySpeed() {
//   console.log(enemyArr.length);
//   for (let i = 0; i < enemyArr.length; i++) {
//     let speed;
//     let enemy = enemyArr[i];
//     if (enemy.size.radius >= 20 && enemy.size.radius <= 35) {
//       speed = Math.floor(Math.random() * (500 - 400 + 1) + 400);
//     } else if (enemy.size.radius >= 36 && enemy.size.radius <= 50) {
//       speed = Math.floor(Math.random() * (300 - 200 + 1) + 200);
//     } else if (enemy.size.radius > 50) {
//       speed = Math.floor(Math.random() * (250 - 100 + 1) + 100);
//     }
//     return speed;
//   }
// }
let powerUpArray = [];

function updateGame() {
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

    // Check collision with power-ups
    for (let i = powerUpArray.length - 1; i >= 0; i--) {
      const powerUp = powerUpArray[i];
      powerUp.update();
      powerUp.draw(playerContext); // Pass the game canvas context to the draw method

      // Check collision with player
      if (powerUp.checkCollisionWithPlayer(player)) {
        console.log("Player picked up power up: ");
        handlePowerUpCollision(powerUp); // Handle the collision
        powerUpArray.splice(i, 1); // Remove the power-up from the array
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

    // playerContext.beginPath();
    // playerContext.font = "bold 120px Arial";
    // playerContext.fillStyle = this.color;
    // playerContext.fillText("Game Over",window.innerWidth/3,window.innerHeight/2);
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

  score.incScore = 0;
  score.hourTime = 0;
  score.minTime = 0;
  score.secTime = 0;

  enemyArr = [];
  enemyInterval = 1000;

  // Clear all previous intervals
  for (let i = 1; i < 99999; i++) {
    window.clearInterval(i);
  }
  player.position.posX = centerPointX;
  player.position.posY = centerPointY;

  gameOverDisplay.style.display = "none";
  gameOverDisplay.style.zIndex = "-1";

  gameLoop();
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
