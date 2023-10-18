let xMin = 0;
let xMax = window.innerWidth;

let yMin = 0;
let yMax = window.innerHeight;

// console.log(xMax , " " , yMax);
class Enemy{
    constructor(player){
        this.position = {
            x : Math.floor(Math.random() * (xMax - xMin + 1) + xMin),
            y : Math.floor(Math.random() * (yMax - yMin + 1) + yMin),
        }
        
        this.color = "Red";
        this.size = {
            radius: 35,
        }
        this.player = player;
        this.checkCollision;
        this.visible = true;
        this.distance;
    }

    draw(){
        // console.log(this.position.x, " " , this.position.y);
        playerContext.beginPath();
        playerContext.strokeStyle = "white";
        playerContext.lineWidth = 2;
        playerContext.fillStyle = this.color;
        playerContext.arc(this.position.x,this.position.y,this.size.radius,0,360);
        playerContext.fill();
        playerContext.stroke();
    }

    move(){
        const dx = this.position.x - this.player.position.posX;
        const dy = this.position.y - this.player.position.posY;
        
        // console.log("The angle between player and enemy =  X : " ,dx," Y : ", dy);

        this.distance = Math.sqrt(dx*dx + dy*dy);

        let speed = 2;
        this.position.x -= (dx / this.distance) * speed;
        this.position.y -= (dy / this.distance) * speed;
    }



    
    enemyToPlayerCollision(){
        this.checkCollision = Math.sqrt(Math.pow(this.position.x-this.player.position.posX,2) + Math.pow(this.position.y-this.player.position.posY,2))


        if(this.checkCollision <= this.size.radius + this.player.radius){
            // console.log("collision detected");
            
            if(this.player.health > 0){
                this.player.health--;
            }
                // console.log(this.player.health);
            if(this.player.health == 0){
            //    clearInterval(dealDamage);
                this.player.isAlive = false;
            }
            
        }
    }



    update(){
        this.draw();
        this.move();
        
        // this.enemyToenemyColision();
        this.enemyToPlayerCollision();
    }

}
