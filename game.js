
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


// //Creating a new layer for player
// let bulletCanvas = document.createElement("canvas");
// let bulletCtx = bulletCanvas.getContext("2d");

// bulletCanvas.width = canvas.width;
// bulletCanvas.height = canvas.height;

// bulletCanvas.style.position = "absolute";
// bulletCanvas.style.top = "0";
// bulletCanvas.style.left = "0";
// bulletCanvas.style.pointerEvents = "none";
// bulletCanvas.style.zIndex = "101";


// document.body.appendChild(bulletCanvas);


window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    playerCanvas.width =  canvas.width;
    playerCanvas.height =  canvas.height;
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


class Enemy{
    constructor(){
        this.x;
        this.y;
        this.color = "Red";

    }

    draw(){
        playerContext.beginPath();
        playerContext.strokeStyle = "white";
        playerContext.lineWidth = 4;
        playerContext.fillStyle = this.color;
        playerContext.arc(this.x,this.y,35,0,360);
        playerContext.fill();
        playerContext.stroke();
    }

    generatePosition(arg){
        let xMax = canvas.width + 50;
        let xMin = -50;
        let yMax = canvas.height + 50;
        let yMin = -50;
        let randomNum;
        let temp;
        if(arg == "x"){
            // if(){
                
            // }
        }else{

        }
    }
}


document.body.addEventListener('click',(e)=>{
    if(e.button == 0){
        isMouseClicked = true;
    }
});

const bullet = new bulletControler();
const player = new Player(bullet);
const enemy = new Enemy();
// const bullet = new Bullet();


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
    bgMusic.play();
    bgMusic.loop = true;

    requestAnimationFrame(gameLoop);
}

function updateGame(){

    player.draw();
    bullet.draw();
    // enemy.draw();
}

gameLoop();