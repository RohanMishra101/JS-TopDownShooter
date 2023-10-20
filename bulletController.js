
//Bullet Controller
class bulletController{
    bullets = [];
    timeTillNextBullets = 0;
    
    
    constructor(score){
        this.r = 4;
        this.checkCollision;
        this.score = score;
    }
    draw(){
        this.bullets.forEach((bullet) =>bullet.draw());

    }
    shoot(x,y,speed,damage,delay,angle){
        if(this.timeTillNextBullets <= 0){

            this.bullets.push(new Bullet(x,y,speed,damage,angle,this.r));
            this.timeTillNextBullets = delay;
        }
        this.timeTillNextBullets--;
    }
    enemyCollision() {
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
                            console.log("Enemy Dead");
                            this.shakeCamera();
                            
                            
                            this.score.incScore += 1;

                            const particle = new Particle(enemy);
                            particleController.createParticle(enemy);
                            shipBoom.play();

                            // Remove the bullet and the enemy
                            this.bullets.splice(i, 1);
                            enemyArr.splice(j, 1);

                        }
                    }
                }
            }
        }
    }

    shakeCamera() {
        const shake = 50;
        const duration = 100;
        const start = Date.now();
    
        function updateCamera() {
            const elapsed = Date.now() - start;
            if (elapsed < duration) {
                const offsetX = Math.random() * shake - shake / 2;
                const offsetY = Math.random() * shake - shake / 2;
    
                playerCanvas.style.left = offsetX + "px";
                playerCanvas.style.top = offsetY + "px";
    
                requestAnimationFrame(updateCamera);
            } else {
                playerCanvas.style.left = "0";
                playerCanvas.style.top = "0";
            }
        }
    
        updateCamera();
    }
    
    
}
