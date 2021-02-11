const Vector2D = require("../../universals/vector2d");
const Client = require("../../server/client.js");
const Terminal = require("../../universals/terminal")

class Player extends Client {
    constructor(id, game, isMobile) {
        super(id, game, isMobile);

        this.pos = new Vector2D(100, 100);
        this.vel = new Vector2D(0,0);
        this.maxSpeed = 140;

        this.radius = 5;

        terminal.log(id + " connected");
    }

    move() {
        if (this.isMobile && this.clientInput.pointer)
        {
            this.vel.set(this.clientInput.pointer.x, this.clientInput.pointer.y);
        } else {
            this.vel = new Vector2D(0,0)
    
            if (this.clientInput.w) {
                this.vel.y += -1;
            }
            if (this.clientInput.s) {
                this.vel.y += 1;
            }
            if (this.clientInput.a) {
                this.vel.x += -1;
            }
            if (this.clientInput.d) {
                this.vel.x += 1;
            }
        }
        
        if (this.vel.magnitude() != 0) {
            this.vel.magnitude(this.maxSpeed * (server.physicsTimeStep / 1000));
            this.pos.add(this.vel);
        }
        
    }

    getUpdate() {
        return {
			id: this.id,
            pos: this.pos,
            vel: this.vel
        }
    }

    returnSelf() {
        return {id: this.id, pos: this.pos, vel: this.vel, radius: this.radius, maxSpeed: this.maxSpeed};
    }
}

module.exports = Player;