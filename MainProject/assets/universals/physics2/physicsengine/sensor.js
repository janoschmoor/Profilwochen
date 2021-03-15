const Collider = require("./collider");
const Vector2D = require("../lib/vector2d")

class Sensor extends Collider {
    constructor(physicsWorld, id, color, pos, vertexBuilder, sensorType, angle = 0, vel = new Vector2D(0, 0), angularVel = 0) {
        super(physicsWorld, id, color, pos, vertexBuilder, angle);

        this.sensorType = sensorType;

        this.vel = vel;
        this.acc = new Vector2D(0, 0);
        this.angularVel = angularVel;
        this.angularAcc = 0;

        this.collidesActive = false;

        this.type = this.constructor.name;
    }
}

Sensor.prototype.collisionDetected = function(id) {
    if (this.sensorType == "endChunk") {
        let index = this.physicsWorld.colliders.findIndex(collider => collider.id === id);
        if (index != -1) {
            if (this.physicsWorld.colliders[index].type === "PlayerCollider") {
                let player = this.physicsWorld.colliders[index].reference;
                if (player.state != "finished") {
                    if (index != -1) {
                        let counter = 0;
                        for (let i = 0; i < player.game.players.length; i++) {
                            if (player.game.players[i].state == "finished") {
                                counter ++;
                            }
                        }
                        if (counter == 0) {
                            player.tempScore += 3;
                        } else {
                            player.tempScore += 1 + Math.round(counter / player.game.players.length);
                        }
                        player.state = "finished";
                        
                        player.game.checkAdvanceGameState();
                    }
                }
                
            } 
            else {
                this.physicsWorld.remove(id);
                this.physicsWorld.game.nextUpdate.specials.push({type:"removeCollider", identifier: id})
            }
        }
    }
    else if (this.sensorType == "startChunk") {
            let index = this.physicsWorld.colliders.findIndex(collider => collider.id === id && collider.type != "PlayerCollider");
            if (index != -1) {
                this.physicsWorld.remove(id);
                this.physicsWorld.game.nextUpdate.specials.push({type:"removeCollider", identifier: id})
            }
    }
}
Sensor.prototype.performCollision = function(other) {
    if (this.performBoundingBoxCollision(other)) {
        if (this.performSAT(other)) {
            if (other.collidesActive) {
                let theseVertexIndecies = this.performPointSAT(other);
                let otherVertexIndecies = other.performPointSAT(this);
    
                // this.performSickMotionCalulation(other, theseVertexIndecies, otherVertexIndecies);
            }
            this.collisionDetected(other.id);
            other.collisionDetected(this.id);
        }
    }
}

module.exports = Sensor;