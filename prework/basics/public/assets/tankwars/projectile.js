class Projectile {
    constructor(projectile) {
        this.type = projectile.type;
        this.gameId = projectile.gameId;
        this.playerId = projectile.playerId;
        this.pos = new Vector2D(projectile.pos.x, projectile.pos.y);
        this.vel = new Vector2D(projectile.vel.x, projectile.vel.y);
        this.life = projectile.life;
        this.radius = projectile.radius;
        this.id = projectile.id;
    }
    render() {
        fill(0,0,0);
        ellipse(this.pos.x * thisPlayer.scope, this.pos.y * thisPlayer.scope, this.radius  * thisPlayer.scope);
    }
    estimatePhysics() {
        this.pos.add(this.vel);
    }
    lifeIsOver() {
        this.life -= timeStep;
        if (this.life < 0) {
          return true;
        }
        return false;
    }
    authUpdate(update) {
        this.pos = new Vector2D(update.pos.x, update.pos.y);
        this.vel = new Vector2D(update.vel.x, update.vel.y);
    }
}