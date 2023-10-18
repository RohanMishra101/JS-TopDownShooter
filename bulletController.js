
//Bullet Controller
class bulletController{
    bullets = [];
    timeTillNextBullets = 0;
    
    
    constructor(){
        this.r = 4;
        this.checkCollision;

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
                            
                            shipBoom.play();


                            const particle = new Particle(enemy);
                            particleController.createParticle(enemy);

                            // Remove the bullet and the enemy
                            this.bullets.splice(i, 1);
                            enemyArr.splice(j, 1);

                        }
                    }
                }
            }
        }
    }
    
    
}
