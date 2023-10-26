
// alert("The game is still under CONSTRUCTION. You can still try it, if you found it laggy then My Brother/Sister its time to upgrade you PC cause it works on mine!!");

//Declaration and Definition
let playerCanvas = document.getElementById("canvas");
playerCanvas.width = window.innerWidth;
playerCanvas.height = window.innerHeight;
playerCanvas.style.pointerEvents = "none";
playerCanvas.style.backgroundColor = "#2B2730";


let playerContext = canvas.getContext("2d");


let mainMenu = document.getElementById("menu");
let playBtn = document.getElementById("playBtn");
// let restartBtn = document.getElementById("restart");
// let gameOverDisplay = document.getElementById("restartBtns");
let exitBtn = document.getElementById("exitBtn");

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    playerCanvas.width = window.innerWidth;
    playerCanvas.height = window.innerHeight;
}

//Screen Center Point
let centerPointX = canvas.width/2;
let centerPointY = canvas.height/2;


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
const enemy = new Enemy(player);
const particleController = new ParticleController();

//Creating Enemy
let i;
let enemyInterval = 1000;


function createEnemy(){
    if(isPaused){
        return;
    }
    setInterval(() =>{
        const enemy = new Enemy(player);
        enemyArr.push(enemy);

        if(enemyInterval > 700){
            enemyInterval = enemyInterval - 4;
        }else{
            enemyInterval = 700;
        }

        if(score.minTime == 4){
            enemyInterval -= 100;
        }
    },enemyInterval);
}


// =-=-=-=-=-=-= Event Listeners =-=-=-=-=-=-=-=

playBtn.addEventListener("click", () =>{
    isAlive = true;
    mainMenu.style.display = "none";
    // gameOverDisplay.style.display = "none";
    playerCanvas.style.display = "block";
    isGameRunning = true;
    gameLoop();
    createEnemy();
});
// restartBtn.addEventListener("click", () => {
//     console.log("Restart");
//     gameOverDisplay.style.display = "none"; // Hide the game over display when restarting
//     restartGame(); // Call the restartGame function here
// });
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        isPaused = true;
        console.log("Tab or window is not visible");
    } else {
        isPaused = false;
        console.log("Tab or window is visible");
    }
});

document.body.addEventListener('click',(e)=>{
    if(e.button == 0){
        isMouseClicked = true;
        shootSound.play();
    }
});

document.body.addEventListener("mousemove",(e)=>{
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

function gameLoop(){
    // console.log("GameLoop");
    measureRefreshRate();

    updateGame();

    requestAnimationFrame(gameLoop);
}

function updateGame(){
    // console.log("Updating");
    playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height); // Clear the player canvas


    if(player.isAlive){
        bgMusic.play();
        bgMusic.loop = true;

        score.update();

        player.draw();
  
        bullet.draw();
        bullet.enemyCollision();

        spawnEnemy();
        particleController.updateParticles();
    }else{
        // gameOverDisplay.style.display = "block";
        score.update();
        bgMusic.pause();
        score.stopTimer();

        playerContext.beginPath();
        playerContext.font = "bold 120px Arial";
        playerContext.fillStyle = this.color;
        playerContext.fillText("Game Over",window.innerWidth/3,window.innerHeight/2);


    }
}

function spawnEnemy(){
    for (let i = 0; i < enemyArr.length; i++) {
        enemyArr[i].update();
    }
}

// function restartGame() {
//     isAlive = true;
//     gameOverDisplay.style.display = "none"
//     // mainMenu.style.display = "none";

//     gameLoop();
//     createEnemy();
// }


function measureRefreshRate() {
    var frameCount = 0;
    var startTime = performance.now();

    function draw() {
        frameCount++;
            // console.log(performance.now() - startTime);
        if (performance.now() - startTime >= 1000) {
            var refreshRate = frameCount;
            // console.log("Estimated Screen Refresh Rate: " + refreshRate + " FPS");

            if(refreshRate < 100){
                player.speed = 10;
                player.enemySpeed = 6;
            }else{
                player.speed = 4;
                player.enemySpeed = 2;
            }
            console.log("Player : ",player.speed);
            console.log("Enemy : ",player.enemySpeed);

           
        } else {
            requestAnimationFrame(draw);
        }
    }

    draw();
}


