let xMin = 0;
let xMax = window.innerWidth;

let yMin = 0;
let yMax = window.innerHeight;

let minSize = 20;
let maxSize = 80;

// console.log(xMax , " " , yMax);
class Enemy {
  constructor(player, bullet) {
    this.size = {
      radius: Math.floor(Math.random() * (maxSize - minSize + 1) + minSize),
    };
    this.position = {
      x: this.generateRandomLocation("x"),
      y: this.generateRandomLocation("y"),
    };

    this.color = "#ef233c";

    this.health = this.generateHealth(this.size.radius);
    this.damage = 20;
    this.player = player;
    this.shakeCamera = bullet;
    this.checkCollision;
    this.visible = true;
    this.distance;
    this.enemyArr = [];
    this.speed = player.enemySpeed;
    this.isShieldOn = false;
    this.shieldHealth;
  }

  draw() {
    // console.log(this.position.x, " " , this.position.y);
    playerContext.beginPath();
    playerContext.strokeStyle = "white";
    playerContext.lineWidth = 2;
    playerContext.fillStyle = this.color;
    playerContext.arc(
      this.position.x,
      this.position.y,
      this.size.radius,
      0,
      360
    );
    playerContext.fill();
    playerContext.stroke();
  }

  move() {
    const dx = this.position.x - this.player.position.posX;
    const dy = this.position.y - this.player.position.posY;

    // console.log("The angle between player and enemy =  X : " ,dx," Y : ", dy);

    this.distance = Math.sqrt(dx * dx + dy * dy);
    this.position.x -= (dx / this.distance) * this.speed;
    this.position.y -= (dy / this.distance) * this.speed;
    // console.log("Enemy Health = " + this.health);
  }

  generateRandomLocation(arg) {
    let randomLocation;
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    switch (side) {
      case 0: // top
        randomLocation = {
          x: Math.floor(Math.random() * (xMax - xMin + 1) + xMin),
          y: yMin - this.size.radius - 50, // Place enemy just above the top edge
        };
        break;
      case 1: // right
        randomLocation = {
          x: xMax + this.size.radius + 50, // Place enemy just to the right of the right edge
          y: Math.floor(Math.random() * (yMax - yMin + 1) + yMin),
        };
        break;
      case 2: // bottom
        randomLocation = {
          x: Math.floor(Math.random() * (xMax - xMin + 1) + xMin),
          y: yMax + this.size.radius + 50, // Place enemy just below the bottom edge
        };
        break;
      case 3: // left
        randomLocation = {
          x: xMin - this.size.radius - 50, // Place enemy just to the left of the left edge
          y: Math.floor(Math.random() * (yMax - yMin + 1) + yMin),
        };
        break;
      default:
        break;
    }
    if (arg === "x") {
      return randomLocation.x;
    } else {
      return randomLocation.y;
    }
  }

  enemyToPlayerCollision() {
    this.checkCollision = Math.sqrt(
      Math.pow(this.position.x - this.player.position.posX, 2) +
        Math.pow(this.position.y - this.player.position.posY, 2)
    );

    if (this.checkCollision <= this.size.radius + this.player.radius) {
      if (this.player.isShieldOn) {
        if (this.player.shieldHealth > 0) {
          let shieldDamage = this.damage - 10;
          this.player.shieldHealth -= shieldDamage;
          console.log("Shield Health  = " + this.player.shieldHealth);
          if (this.player.shieldHealth <= 0) {
            this.player.isShieldOn = false;
          }
        }
      } else {
        if (this.player.health > 0) {
          // Calculate push-back direction
          const unitVectorX =
            (this.position.x - this.player.position.posX) / this.checkCollision;
          const unitVectorY =
            (this.position.y - this.player.position.posY) / this.checkCollision;

          // Push back the player while keeping them within bounds
          const pushBackDistance = 120;
          const newX =
            this.player.position.posX - unitVectorX * pushBackDistance;
          const newY =
            this.player.position.posY - unitVectorY * pushBackDistance;

          // Check if new position is within bounds
          if (
            newX >= 0 &&
            newX <= canvas.width &&
            newY >= 0 &&
            newY <= canvas.height
          ) {
            this.player.position.posX = newX;
            this.player.position.posY = newY;
          }

          // Apply damage to player
          this.shakeCamera.shakeCamera(70, 100);
          setTimeout(() => {
            if (this.player.health > 0) {
              this.player.health -= this.damage;
              if (this.player.health <= 0) {
                this.player.isAlive = false;
              }
            }
          }, 1000);
        }
      }
    }
  }

  generateHealth(size) {
    if (size >= 20 && size <= 35) {
      return Math.floor(Math.random() * (60 - 40 + 1)) + 40;
    } else if (size >= 36 && size <= 60) {
      return Math.floor(Math.random() * (150 - 60 + 1)) + 60;
    } else if (size > 60) {
      return Math.floor(Math.random() * (300 - 150 + 1)) + 150;
    }
  }

  update() {
    // this.generateRandomLocation();
    this.draw();
    this.move();

    this.enemyToPlayerCollision();
  }
}
