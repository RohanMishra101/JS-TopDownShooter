class ParticleController {
    constructor() {
        this.particles = [];
        this.totalParticles = 15;
    }

    createParticle(enemy) {
        for(let i =0; i < this.totalParticles; i++){
            const particle = new Particle(enemy);
            this.particles.push(particle);
        }
    }

    drawParticles() {
        this.particles.forEach(particle => particle.draw());
        this.particles.forEach(particle => particle.move());

    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.decreaseLife();
            if(particle.life > 0){
                return true;
            }else{
                return false;   
            }

        });
        this.drawParticles();
    }
}