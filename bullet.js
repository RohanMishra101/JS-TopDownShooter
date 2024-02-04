class Bullet{
    constructor(x,y,speed,damage,angle,r) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage;

        this.width = 5;
        this.height = 15;
        this.color = "blue";
        this.angle = angle;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.r = r; 
        
    }
    draw(){
        playerContext.beginPath();
        playerContext.fillStyle = this.color;
        this.x += this.speedX;
        this.y += this.speedY;
        playerContext.arc(this.x,this.y,this.r,0,2 * Math.PI);
        playerContext.fill();
    } 
}
