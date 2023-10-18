
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

playerCanvas.style.position = "absolute";
playerCanvas.style.top = "0";
playerCanvas.style.left = "0";
playerCanvas.style.pointerEvents = "none";
playerCanvas.style.zIndex = "100";


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

// 90 degrees in clockwise direction
const initialOffsetAngle = Math.PI / 2; 

//Music
const bgMusic = new Audio();
const shootMusic = new Audio();
bgMusic.src = "./Music/bgSpace.mp3";
bgMusic.volume = 0.3;

const p = new Image();
p.src = "./img/me.png";


//Enemy
let enemyArr = [];


document.body.addEventListener('click',(e)=>{
    if(e.button == 0){
        isMouseClicked = true;
    }
});

const bullet = new bulletController();
const player = new Player(bullet);
const enemy = new Enemy(player);
const particleController = new ParticleController
();
// let enemy;
let totalEnemyNo = 10;
let i;

for(i = 0; i < totalEnemyNo; i++){
    setTimeout(() =>{
        const enemy = new Enemy(player);
        enemyArr.push(enemy);
        console.log(enemyArr);
    },i*2000);
    // enemy[i].update();
}

document.body.addEventListener("mousemove",(e)=>{
    mousePosX = parseInt(e.clientX);
    mousePosY = parseInt(e.clientY);

    // console.log("X : ", mousePosX," Y : ",mousePosY);
});


// Initialize an object to store the state of the keys
const keys = {};

// Event listeners for keydown and keyup events to track the state of the keys
document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function gameLoop(){
    updateGame();
    // bgMusic.play();
    // bgMusic.loop = true;

    requestAnimationFrame(gameLoop);
}

function updateGame(){

    if(player.isAlive){
        player.draw();
        bullet.draw();
        bullet.enemyCollision();
        // enemy.update();
        spawnEnemy();
        particleController.updateParticles();
        // particleController.drawParticles();

    }
    
}

function spawnEnemy(){
    for (let i = 0; i < enemyArr.length; i++) {
        enemyArr[i].update();
    }
}

gameLoop();