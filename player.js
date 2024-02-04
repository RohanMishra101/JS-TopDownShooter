//Player
class Player {
  constructor(bulletController) {
    this.position = {
      posX: centerPointX,
      posY: centerPointY,
    };

    this.bulletController = bulletController;
    this.health = 100;
    this.speed;
    this.angle;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.color = "#38a3a5";
    this.radius = 35;
    this.isAlive;
    this.enemySpeed;
  }
  draw() {
    // Set shadow properties for the glow effect
    playerContext.shadowColor = "White"; // Color of the glow
    playerContext.shadowBlur = 1000; // Blur radius of the glow
    playerContext.shadowOffsetX = 0; // Horizontal offset of the glow
    playerContext.shadowOffsetY = 0; // Vertical offset of the glow

    playerContext.save();
    playerContext.translate(this.position.posX, this.position.posY);
    playerContext.rotate(this.angle + initialOffsetAngle);
    playerContext.beginPath();
    playerContext.fillStyle = "White";
    playerContext.rect(-7.5, -45, 15, 80);
    playerContext.fill();

    playerContext.beginPath();
    playerContext.strokeStyle = "white";
    playerContext.lineWidth = 4;
    playerContext.fillStyle = this.color;
    playerContext.arc(0, 0, this.radius, 0, 360);
    playerContext.fill();
    playerContext.stroke();

    // playerContext.drawImage(p,0,0,200,100);
    playerContext.restore();

    this.rotate();
    this.move();
    this.shoot();
  }

  rotate() {
    const deltaX = mousePosX - this.position.posX;
    const deltaY = mousePosY - this.position.posY;
    this.angle = Math.atan2(deltaY, deltaX);
  }

  move() {
    // Calculate the new positions
    let newPosX = this.position.posX;
    let newPosY = this.position.posY;

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
      this.position.posX = newPosX;
    }
    if (newPosY > 0 && newPosY < this.canvasHeight) {
      // playerPosY = this.posY;
      this.position.posY = newPosY;
    }
  }

  shoot() {
    if (isMouseClicked) {
      // shootMusic.src = "/./Music/shoot.wav";

      isMouseClicked = false;
      // console.log("shoot");
      const speed = 20;
      const delay = 1;
      const damage = 50;
      // Calculate the adjusted angle for shooting
      const adjustedAngle = this.angle - initialOffsetAngle - 0.17;

      // Calculate the rotated coordinates of the bottom-center of the player
      const playerBottomX = this.position.posX - 7.5 * Math.cos(adjustedAngle);
      const playerBottomY = this.position.posY - 7.5 * Math.sin(adjustedAngle);

      // Calculate the offset based on player's rotation and set bullet positions
      const offsetX = 45 * Math.sin(adjustedAngle);
      const offsetY = 45 * Math.cos(adjustedAngle);

      const bulletX = playerBottomX - offsetX;
      const bulletY = playerBottomY + offsetY;

      this.bulletController.shoot(
        bulletX,
        bulletY,
        speed,
        damage,
        delay,
        this.angle
      );
    }
  }
}
