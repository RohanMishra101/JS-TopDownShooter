
// alert("The game is still under CONSTRUCTION. You can sillt try it, if you found it laggy then My Brother/Sister its time to upgrade you PC cause it works on mine!!");

let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");

//Creating a new layer for player
let playerCanvas = document.createElement("canvas");
let playerContext = playerCanvas.getContext("2d");

playerCanvas.width = canvas.width;
playerCanvas.height = canvas.height;

// playerCanvas.style.background = "Red";
playerCanvas.style.position = "absolute";
playerCanvas.style.top = "0";
playerCanvas.style.left = "0";
playerCanvas.style.pointerEvents = "none";
playerCanvas.style.zIndex = "100";
playerCanvas.style.backgroundColor = "#2B2730";
canvas.style.backgroundColor = "#2B2730";
document.body.appendChild(playerCanvas);



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

// console.log("X : ", centerPointX," Y : ",centerPointY);

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


shipBoom.src = "./Music/destroyShip.wav";
shipBoom.volume = 0.1;

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
        // console.log(enemyInterval);
        const enemy = new Enemy(player);
        enemyArr.push(enemy);
        // console.log("HEllo");
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






// =-=-=-=-=-=-= Event Listiners =-=-=-=-=-=-=-=
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

    // console.log("X : ", mousePosX," Y : ",mousePosY);
});


const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function gameLoop(){
    // playerContext.clearRect(0, 0, canvas.width, canvas.height);
    updateGame();
    
    requestAnimationFrame(gameLoop);
}

function updateGame(){
    // ui.draw();

    playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height); // Clear the player canvas
    // bgParticles.update();
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
        score.update();
        bgMusic.pause();
        score.stopTimer();
        playerContext.beginPath();
        playerContext.font = "bold 190px Arial";
        playerContext.fillStyle = this.color;
        playerContext.fillText("Game Over",window.innerWidth/3.5,window.innerHeight/2);
    }
}




function spawnEnemy(){
    for (let i = 0; i < enemyArr.length; i++) {
        enemyArr[i].update();
    }
}

gameLoop();
createEnemy();