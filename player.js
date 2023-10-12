//Player
class Player{
    constructor(bulletControler){
        this.posX = centerPointX;
        this.posY = centerPointY;
        this.bulletControler = bulletControler;
        this.health = 100;
        this.speed = 3;
        this.angle;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.color = "Blue";
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
        playerContext.fillStyle = this.color;
        playerContext.arc(0,0,35,0,360);
        playerContext.fill();
        playerContext.stroke();


        // playerContext.drawImage(p,0,0,200,100);
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
            shootMusic.src = "/./Music/shoot.wav";
            shootMusic.play();
            shootMusic.volume = 0.2;
            isMouseClicked = false;
            console.log("shoot");
            const speed = 8;
            const delay = 1;
            const damage = 1;
            // Calculate the adjusted angle for shooting
            const adjustedAngle = this.angle - initialOffsetAngle;

            // Calculate the rotated coordinates of the bottom-center of the player
            const playerBottomX = this.posX - 7.5 * Math.cos(adjustedAngle); 
            const playerBottomY = this.posY - 7.5 * Math.sin(adjustedAngle); 

            // Calculate the offset based on player's rotation and set bullet positions
            const offsetX = 45 * Math.sin(adjustedAngle); 
            const offsetY = 45 * Math.cos(adjustedAngle); 

            const bulletX = playerBottomX - offsetX;
            const bulletY = playerBottomY + offsetY;

            this.bulletControler.shoot(bulletX,bulletY,speed,damage,delay,this.angle);
        }
    }
}
