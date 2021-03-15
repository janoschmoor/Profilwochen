const Vector2D = require("../../vector2d");
const Rectangle = require("./collisionshapes/rectangle");
const Sensor = require("./sensor");

class Wiretrap extends Sensor {
    constructor(physicsWorld, id, color, pos, vertexBuilder, angle = 0) {
        super(physicsWorld, id, color, pos, vertexBuilder, angle);

        this.collidesActive = false;

        this.type = this.constructor.name;
    }
}

Wiretrap.prototype.collisionDetected = function(id) {
    let index = this.physicsWorld.colliders.findIndex(collider => collider.id === id && collider.type == "PlayerCollider");
    if (index != -1) {
        let player = this.physicsWorld.colliders[index].reference;
        player.die();
    }
}

module.exports = Wiretrap;