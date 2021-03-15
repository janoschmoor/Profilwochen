const Turret = require("./turret");

const Entity = require("./entity");
const Vector2D = require("../lib/vector2d");

class TurretProjectile extends Entity{
	constructor(physicsWorld, id, color, pos, vertexBuilder, owner, angle, vel) {
        super(physicsWorld, id, color, pos, vertexBuilder, angle, vel);        
        this.life = 100;
        this.owner = owner;
	}
}
TurretProjectile.prototype.customRun = function() {
    this.life--;
    if (this.life < 0) {
        this.physicsWorld.remove(this.id);
    }
}

TurretProjectile.prototype.updateMotionState = function() {
    // this.previousVel = new Vector2D(this.vel.x, this.vel.y);

    // console.log("physictimestep", physicsWorld.timestep, physicsWorld.gravity._magnitude(physicsWorld.timestep))
    this.acc.add(this.physicsWorld.gravity._magnitude(this.physicsWorld.gravity.magnitude() * this.physicsWorld.timestep / 40));
    // console.log(this.acc.magnitude())
    // noLoop()

    this.vel.add(this.acc);
    this.pos.add(this.vel._magnitude(this.vel.magnitude() * this.physicsWorld.timestep));
    this.rotate(this.angularVel * this.physicsWorld.timestep);

    this.acc.set(0,0);
}

TurretProjectile.prototype.collisionDetected = function(id) {
    let index = this.physicsWorld.colliders.findIndex(c => c.id == id && c.type == "PlayerCollider");
    if (index != -1) {
        this.physicsWorld.colliders[index].reference.die();
        index = this.physicsWorld.colliders.findIndex(c => c.id == this.owner && c.type == "PlayerCollider");
        this.physicsWorld.colliders[index].tempScore += 1;
    }
}

TurretProjectile.prototype.performSickMotionCalulation = function(other, theseVertexIndecies, otherVertexIndecies) {
    let translationCorrection = {vector: new Vector2D(0, 0), vertex: -1};
    for (let i = 0; i < theseVertexIndecies.length; i++) {
        let temp = this.getPositionCorrection(theseVertexIndecies[i], other);
        if (temp.magnitude() > translationCorrection.vector.magnitude()) {
            translationCorrection.vector = temp;
            translationCorrection.vertex = this.vertecies[theseVertexIndecies[i]];
            translationCorrection.plane = this.vertecies[([theseVertexIndecies[i]] + 1) % this.vertecies.length]._sub(this.vertecies[theseVertexIndecies[i]]);
        }
    }
    for (let i = 0; i < otherVertexIndecies.length; i++) {
        let temp = other.getPositionCorrection(otherVertexIndecies[i], this);
        temp.magnitude( - temp.magnitude());
        if (temp.magnitude() > translationCorrection.vector.magnitude()) {
            translationCorrection.vector = temp;
            translationCorrection.vertex = other.vertecies[otherVertexIndecies[i]];
            translationCorrection.plane = other.vertecies[([otherVertexIndecies[i]] + 1) % other.vertecies.length]._sub(other.vertecies[otherVertexIndecies[i]]);

        }
    }
    
    if (translationCorrection.vertex != -1) {
        if (translationCorrection.vector.magnitude() > 0) {  
            let alpha = -translationCorrection.plane.interiorAngle(this.vel);
            let exitAngle = translationCorrection.plane.interiorAngle() + alpha;
            this.vel = Vector2D.fromAngle(exitAngle).magnitude(this.vel.magnitude());
            this.hardPositionUpdate(translationCorrection.vector.magnitude(translationCorrection.vector.magnitude()*2)); // ATTENTION: may cause problems if no vector is returned
        }
    } else {

    }
}

module.exports = TurretProjectile;