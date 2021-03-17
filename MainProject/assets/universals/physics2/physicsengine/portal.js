const Vector2D = require("../../vector2d");
const Rectangle = require("./collisionshapes/rectangle");
const Sensor = require("./sensor");

class Portal extends Sensor{
	constructor(physicsWorld, id, color, pos, vertexBuilder, angle = 0) {
        super(physicsWorld, id, color, pos, vertexBuilder, null, angle);
        
        this.cooldown = 101;
        this.collidesActive = false;

        this.type = this.constructor.name;
	}
}



Portal.prototype.collisionDetected = function(id) {
    let index = this.physicsWorld.colliders.findIndex(collider => collider.id === id && collider.type == "PlayerCollider");
    if (index != -1 && this.cooldown >= 100) {
        let player = this.physicsWorld.colliders[index].reference;
        let indices = [];
        for (let i = 0; i < this.physicsWorld.updatables.length; i++) {
            if (this.physicsWorld.updatables[i].type === "Portal" && this.physicsWorld.updatables[i].cooldown >= 100) {
                if (this.physicsWorld.updatables[i] !== this) {
                    indices.push(i);
                }
            }
        }
        if (indices.length > 0) {
            let temp = Math.floor(Math.random() * (indices.length));
            player.tp(new Vector2D(this.physicsWorld.updatables[indices[temp]].pos.x, this.physicsWorld.updatables[indices[temp]].pos.y));
            this.cooldown = 0;
            this.physicsWorld.updatables[indices[temp]].cooldown = 0;
            console.log("1" , indices.length);
        }
    }
    // console.log(this.physicsWorld.updatables);
}

Portal.prototype.update = function() {
    if (this.cooldown < 100) {
        this.cooldown += 1;
    }
}

module.exports = Portal;