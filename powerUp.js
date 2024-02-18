class PowerUp {
  constructor(x, y, type) {
    this.position = {
      x: x,
      y: y,
    };
    this.size = {
      width: 60,
      height: 60,
    };
    this.type = type;
    this.timer = 8;
    this.isActive = true;
    this.image = this.loadImage();
  }

  loadImage() {
    let imageUrl;
    switch (this.type) {
      case 1:
        imageUrl = "img/boost.png";
        break;
      case 2:
        imageUrl = "img/bullet.png";
        break;
      case 3:
        imageUrl = "img/heart.png";
        break;
      case 4:
        imageUrl = "img/shield.png";
        break;
      default:
        imageUrl = "img/heart.png"; // Default image
    }
    const image = new Image();
    image.src = imageUrl;
    return image;
  }

  draw(context) {
    if (this.isActive) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height
      );
    }
  }

  update() {
    if (this.isActive) {
      this.timer -= 1 / 60;
      if (this.timer <= 0) {
        this.isActive = false;
      }
    }
  }

  checkCollisionWithPlayer(player) {
    const playerRect = {
      x: player.position.posX - player.radius,
      y: player.position.posY - player.radius,
      width: player.radius * 2,
      height: player.radius * 2,
    };

    const powerUpRect = {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };

    if (
      playerRect.x < powerUpRect.x + powerUpRect.width &&
      playerRect.x + playerRect.width > powerUpRect.x &&
      playerRect.y < powerUpRect.y + powerUpRect.height &&
      playerRect.y + playerRect.height > powerUpRect.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}
