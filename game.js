
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
    // bulletCanvas.width = canvas.width;
    // bulletCanvas.height = canvas.height;
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

//Player
class Player{
    constructor(bulletControler){
        this.posX = centerPointX;
        this.posY = centerPointY;
        this.bulletControler = bulletControler
        this.health = 100;
        this.speed = 3;
        this.angle;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }
    draw(){
        // Set shadow properties for the glow effect
        playerContext.shadowColor = "White"; // Color of the glow
        playerContext.shadowBlur = 7; // Blur radius of the glow
        playerContext.shadowOffsetX = 0; // Horizontal offset of the glow
        playerContext.shadowOffsetY = 0; // Vertical offset of the glow

        playerContext.clearRect(0,0,canvas.width,canvas.height);

        playerContext.save();
        playerContext.translate(this.posX,this.posY);
        playerContext.rotate(this.angle + initialOffsetAngle);
        playerContext.beginPath();
        playerContext.fillStyle = "White";
        playerContext.rect(-7.5,-45,15,80);
        playerContext.fill();

        playerContext.beginPath();
        playerContext.strokeStyle = "white";
        playerContext.lineWidth = 4;
        playerContext.fillStyle = "Red";
        playerContext.arc(0,0,35,0,360);
        playerContext.fill();
        playerContext.stroke();

        playerContext.restore();

        this.rotate();
        this.move();
        this.shoot();
    }

    rotate(){
        const deltaX = mousePosX - this.posX;
        const deltaY = mousePosY - this.posY;
        this.angle = Math.atan2(deltaY, deltaX);
    }

    move(){
        
        // Calculate the new positions
        let newPosX = this.posX;
        let newPosY = this.posY;

        if (keys["KeyW"]) {
           newPosY -= this.speed;
        }
        if (keys["KeyA"]) {
           newPosX -= this.speed;
        }
        if (keys["KeyS"]) {
           newPosY += this.speed;
        }
        if (keys["KeyD"]) {
           newPosX += this.speed;
        }

        // Check if the new positions are within the canvas boundaries
        if (newPosX > 0 && newPosX < this.canvasWidth) {
            // playerPosX = this.posX;
            this.posX = newPosX;
        }
        if (newPosY > 0 && newPosY < this.canvasHeight) {
            // playerPosY = this.posY;
            this.posY = newPosY;
        }
        
    }

    shoot(){
        if(isMouseClicked){
            isMouseClicked = false;
            console.log("shoot");
            const speed = 10;
            const delay = 1;
            const damage = 1;
            // Calculate the adjusted angle for shooting
            const adjustedAngle = this.angle - initialOffsetAngle;

            // Calculate the rotated coordinates of the bottom-center of the player
            const playerBottomX = this.posX - 7.5 * Math.cos(adjustedAngle); // 7.5 is half of the player's width
            const playerBottomY = this.posY - 7.5 * Math.sin(adjustedAngle); // 7.5 is half of the player's width

            // Calculate the offset based on player's rotation and set bullet positions
            const offsetX = 45 * Math.sin(adjustedAngle); // 45 is half of the player's height
            const offsetY = 45 * Math.cos(adjustedAngle); // 45 is half of the player's height

            const bulletX = playerBottomX - offsetX;
            const bulletY = playerBottomY + offsetY;

            this.bulletControler.shoot(bulletX,bulletY,speed,damage,delay,this.angle);
        }
    }
}


//Bullet Controller
class bulletControler{
    bullets = [];
    timeTillNextBullets = 0;
    constructor(){

    }
    draw(){
        this.bullets.forEach((bullet) =>bullet.draw());
    }
    shoot(x,y,speed,damage,delay,angle){
        if(this.timeTillNextBullets <= 0){
            this.bullets.push(new Bullet(x,y,speed,damage,angle));
            this.timeTillNextBullets = delay;
        }
        this.timeTillNextBullets--;
    }
}

class Bullet{
    constructor(x,y,speed,damage,angle) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;

        this.width = 5;
        this.height = 15;
        this.color = "blue";
        this.angle = angle;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed; 

    }
    draw(){
        playerContext.beginPath();
        playerContext.fillStyle = this.color;
        this.x += this.speedX;
        this.y += this.speedY;
        playerContext.rect(this.x,this.y,this.width,this.height);
        playerContext.fill();
    }
}


document.body.addEventListener('click',(e)=>{
    if(e.button == 0){
        isMouseClicked = true;
    }
});

const bullet = new bulletControler();
const player = new Player(bullet);
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

    requestAnimationFrame(gameLoop);
}

function updateGame(){
    
    player.draw();
    bullet.draw();
}

gameLoop();