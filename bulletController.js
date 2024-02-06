//Bullet Controller
class bulletController {
  bullets = [];
  timeTillNextBullets = 0;

  constructor(score) {
    this.r = 6;
    this.checkCollision;
    this.score = score;
    this.shipBoom = new Audio();
    this.shipBoom.src = "./Music/destroyShip.wav";
    this.shipBoom.volume = 0.1;
    this.powerUpArray = [];
  }
  draw() {
    this.bullets.forEach((bullet) => bullet.draw());
  }
  shoot(x, y, speed, damage, delay, angle) {
    speed += 30;
    if (this.timeTillNextBullets <= 0) {
      this.bullets.push(new Bullet(x, y, speed, damage, angle, this.r));
      this.timeTillNextBullets = delay;
    }
    this.timeTillNextBullets--;
  }
  enemyCollision() {
    // let powerUpArray = [];

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (bullet && bullet.x !== undefined) {
        for (let j = enemyArr.length - 1; j >= 0; j--) {
          const enemy = enemyArr[j];
          if (enemy && enemy.position && enemy.position.x !== undefined) {
            const dx = bullet.x - enemy.position.x;
            const dy = bullet.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.r + enemy.size.radius) {
              if (enemy.health > 0) {
                enemy.health -= bullet.damage;

                // Shake camera for a hit
                this.shakeCamera(
                  enemy.health > 0 ? 10 : 40,
                  enemy.health > 0 ? 30 : 70
                );

                setTimeout(() => {
                  this.bullets.splice(i, 1);

                  // Remove enemy if health is zero or less
                  if (enemy.health <= 0) {
                    this.score.incScore += 1;
                    this.shipBoom.play();

                    const particle = new Particle(enemy);
                    particleController.createParticle(enemy);
                    enemyArr.splice(j, 1);

                    const randomNumber = Math.random();
                    let powerUpType;

                    if (randomNumber < 0.6) {
                      // No power-up dropped
                    } else if (randomNumber < 0.65) {
                      powerUpType = 1;
                    } else if (randomNumber < 0.7) {
                      powerUpType = 2;
                    } else if (randomNumber < 0.85) {
                      powerUpType = 3;
                    } else {
                      powerUpType = 4;
                    }

                    if (powerUpType) {
                      const powerUp = new PowerUp(
                        enemy.position.x,
                        enemy.position.y,
                        powerUpType
                      );
                      powerUpArray.push(powerUp);
                    }
                  }
                }, 0);
              }
            }
          }
        }
      }
    }
  }

  shakeCamera(shakeRate, timeDuration) {
    const shake = shakeRate;
    const duration = timeDuration;
    const start = Date.now();

    function updateCamera() {
      const elapsed = Date.now() - start;
      if (elapsed < duration) {
        const offsetX = Math.random() * shake - shake / 2;
        const offsetY = Math.random() * shake - shake / 2;

        playerCanvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        requestAnimationFrame(updateCamera);
      } else {
        playerCanvas.style.transform = "translate(0, 0)";
      }
      playerCanvas.style.zIndex = "1";
    }

    updateCamera();
  }
}
