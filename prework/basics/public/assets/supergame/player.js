class Player {
    constructor(player) {
        this.isHost = player.isHost;
        this.gameId = player.gameId;
        this.connectedToGame = player.connectedToGame;
        this.playesGameType = player.playesGameType;
        this.id = player.id;

        this.pos = player.pos;
        this.vel = player.vel;
        this.acc = player.acc;
        this.frictionCoefficient = player.frictionCoefficient;
        this.shape = player.shape;
        this.movementSpeed = player.movementSpeed;
    }
    estimatePhysics(i) {

        // let timeStep = (Date.now() - timeOfLastPhysicsEstimation) / 1000;
        // timeOfLastPhysicsEstimation = Date.now();

        // this.vel.mult(new Vector2D(this.frictionCoefficient, this.frictionCoefficient));
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        
    }
    render(i) {
        ellipse(this.pos.x * thisPlayer.scope, this.pos.y * thisPlayer.scope, this.shape.r * thisPlayer.scope);
    }
    authUpdate(update) {
        this.pos = update.pos;
        this.vel = update.vel;
    }
}