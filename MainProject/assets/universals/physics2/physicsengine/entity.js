const Collider = require("./collider");
const Vector2D = require("../lib/vector2d")

class Entity extends Collider {
    constructor(physicsWorld, id, color, pos, vertexBuilder, angle, vel = new Vector2D(0, 0), angularVel = 0) {
        super(physicsWorld, id, color, pos, vertexBuilder, angle, true);

        this.vel = vel;
        this.acc = new Vector2D(0, 0);
        this.angularVel = angularVel;
        this.angularAcc = 0;

        this.drag = new Vector2D(0.98, 0.98);

        this.touchingVertices = [];
        for (let i = 0; i < vertexBuilder.length; i++) {
            this.touchingVertices.push(false);
        }

        this.type = this.constructor.name;
    }
}

Entity.prototype.addCentralForce = function() {

}
Entity.prototype.getUpdate = function() {
    return {
        id: this.id,
        pos: this.pos,
        angle: this.angle,
        angularVel: this.angularVel,
        vel: this.vel
    }
}

Entity.prototype.collisionVertexFound = function(thisVertexIndex, other) {
    if (other.type != "PlayerCollider") {
        this.touchingVertices[thisVertexIndex] = true;
    }
}

Entity.prototype.resetTouchingVertices = function() {
    for (let i = 0; i < this.touchingVertices.length; i++) {
        this.touchingVertices[i] = false;
    }
}

Entity.prototype.returnSelf = function() {
    return {
        id: this.id,
        pos: this.pos,
        vel: this.vel,
        angularVel: this.angularVel,
        vertexBuilder: this.vertexBuilder,
        angle: this.angle,

        vertecies: this.vertecies,
        boundingBox: this.boundingBox,

        mass: this.mass,
        elasticity: this.elasticity,
        staticFrition: this.staticFrition,

        sleep: this.sleep,
        isActive: this.isActive,
        type: this.type,

        color: this.color
    }
}



module.exports = Entity;