class scoreBoard{
    constructor(){
        this.s_position = {
            x : 70,
            y : 100,
        }
        this.t_position = {
            x : window.innerWidth - 300,
            y : 100,
        }
        this.color = "White";
        this.incScore = 0;

        this.timer;
        this.hourTime = 0;
        this.minTime = 0;
        this.secTime = 0;
    }


    draw(){
        //Score Board
        this.drawScore();

        //Timer
        this.drawTime();
    }

    drawScore(){
        playerContext.beginPath();
        playerContext.font = "bold 90px Arial";
        playerContext.fillStyle = this.color;
        playerContext.fillText(this.incScore,this.s_position.x,this.s_position.y);
    }

    drawTime(){
        playerContext.beginPath();
        playerContext.font = "bold 90px Arial";
        playerContext.fillStyle = this.color;
        playerContext.fillText(this.minTime + " : " + this.secTime,this.t_position.x,this.t_position.y);
    }

    // Timer
    incTimer(){
        if(this.timer == null){
            this.timer = setInterval(() => {
                this.incrementSec();

                this.incTimer();
            },1000);
        }
    }  
    //Second, Min, hr
    incrementSec(){
        if(this.secTime == 60){
            this.secTime = 0;
            if(this.minTime < 61){
                this.minTime += 1;
            }else{
                this.minTime = 0;
                this.hourTime += 1;
                console.log("Congo!!! Now Go Touch Some Grass");
            }
        }else{
            this.secTime += 1; 
        }
    } 



    stopTimer() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    update(){
        this.draw();
        this.incTimer();
    }
}