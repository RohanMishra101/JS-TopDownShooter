let xMin = 0;
let xMax = window.innerWidth;

let yMin = 0;
let yMax = window.innerHeight;

// console.log(xMax , " " , yMax);
class Enemy{
    constructor(player){
        this.size = {
            radius: 35,
        }
        this.position = {
            x: this.generateRandomLocation("x"),
            y: this.generateRandomLocation("y"),
        }
        
        this.color = "#ef233c";
        
        this.player = player;
        this.checkCollision;
        this.visible = true;
        this.distance;
        this.enemyArr = [];
        this.speed = player.enemySpeed;

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

        // let speed = 2;
        this.position.x -= (dx / this.distance) * this.speed;
        this.position.y -= (dy / this.distance) * this.speed;
    }    

    generateRandomLocation(arg){
        let randomLocation;
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        
        switch (side) {
            case 0: // top
                randomLocation = {
                    x: Math.floor(Math.random() * (xMax - xMin + 1) + xMin),
                    y: yMin - this.size.radius - 10 // Place enemy just above the top edge
                };
                break;
            case 1: // right
                randomLocation = {
                    x: xMax + this.size.radius + 10, // Place enemy just to the right of the right edge
                    y: Math.floor(Math.random() * (yMax - yMin + 1) + yMin)
                };
                break;
            case 2: // bottom
                randomLocation = {
                    x: Math.floor(Math.random() * (xMax - xMin + 1) + xMin),
                    y: yMax + this.size.radius + 10 // Place enemy just below the bottom edge
                };
                break;
            case 3: // left
                randomLocation = {
                    x: xMin - this.size.radius - 10, // Place enemy just to the left of the left edge
                    y: Math.floor(Math.random() * (yMax - yMin + 1) + yMin)
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
        // this.createEnemy();
        // this.generateRandomLocation();
        this.draw();
        this.move();
        
        // this.enemyToenemyCollision();
        this.enemyToPlayerCollision();
    }

}
