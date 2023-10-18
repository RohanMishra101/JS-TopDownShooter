let maxRadius = 35/3;
let minRadius = 7;


class Particle{
    
    constructor(enemy){
        this.enemy = enemy;
        this.size = {
            r : Math.floor(Math.random() * (maxRadius - minRadius + 1) + minRadius),
        } 
        this.position = {
            x : this.enemy.position.x,
            y : this.enemy.position.y,
        }
        this.velocity = {
            x : Math.random() * 2 - 1,
            y : Math.random() * 2 - 1,
        }
        // this.color = this.generateRandomColor();
        this.color = "Red";
        this.life = 80;
    }
    draw(){
        playerContext.beginPath();
        playerContext.fillStyle = this.color;
        playerContext.arc(this.position.x,this.position.y,this.size.r,0,360);
        playerContext.fill();
    }
    move(){ 
        // const dx = this.position.x - this.player.position.posX;
        // const dy = this.position.y - this.player.position.posY;
        
        // // console.log("The angle between player and enemy =  X : " ,dx," Y : ", dy);

        // let distance = Math.sqrt(dx*dx + dy*dy);
        
        // let speed = 0.8;
        // this.position.x -= (dx / distance) * speed;
        // this.position.y -= (dy / distance) * speed;




        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    decreaseLife(){
        this.life--;
        // this.opacity -= 0.1;
    }

}