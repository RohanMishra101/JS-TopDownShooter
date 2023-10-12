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
