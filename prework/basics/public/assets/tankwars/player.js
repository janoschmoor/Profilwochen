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
        this.movementSpeed = player.movementSpeed;

        this.shape = player.shape;
        this.scope = 50;
        this.color = new Color(player.color.r, player.color.g, player.color.b, player.color.alpha);
    }
    estimatePhysics(i) {

        // this.pos.x += this.vel.x * timeStep;
        // this.pos.y += this.vel.y * timeStep;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.shape.rotation += this.shape.rotationalVel;
        
        
    }
    render(i) {
        translate(this.pos.x * thisPlayer.scope, this.pos.y * thisPlayer.scope);
        rotate(this.shape.rotation);
        this.color.set();

        rect(0, 0, this.shape.length * thisPlayer.scope, this.shape.width * thisPlayer.scope);
        // line()
        rect(0, 0, this.shape.length * thisPlayer.scope, this.shape.width * thisPlayer.scope*0.61);
        // this.weapon.render();

        rotate(-this.shape.rotation);
        translate(-this.pos.x * thisPlayer.scope, -this.pos.y * thisPlayer.scope);
    }
    authUpdate(update) {
        this.pos = update.pos;
        this.vel = update.vel;
        this.shape.rotation = update.rotation;
        this.shape.rotationalVel = update.rotationalVel;
    }
}