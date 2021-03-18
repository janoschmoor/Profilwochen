const Sensor = require("./sensor");
const Vector2D = require("../lib/vector2d");

class Bomb extends Sensor{
	constructor(physicsWorld, id, color, pos, vertexBuilder, angle = 0, mass = 0) {
		super(physicsWorld, id, color, pos, vertexBuilder, "");

		this.isActive = false;
		this.type = this.constructor.name;
	}
}

Bomb.prototype.explode = function() {
	for (let i = this.physicsWorld.colliders.length-1; i >= 0; i--) {
		if (this.physicsWorld.colliders[i] != this) {
			if (this.physicsWorld.colliders[i].partOfMap) {	
			} else if (this.physicsWorld.colliders[i].type != "PlayerCollider" && this.performSAT(this.physicsWorld.colliders[i])) {
				this.physicsWorld.game.nextUpdate.specials.push({type: "removeCollider", identifier: this.physicsWorld.colliders[i].id})
				this.physicsWorld.remove(this.physicsWorld.colliders[i].id);
				
			}
		}
	}
	this.physicsWorld.game.nextUpdate.specials.push({type: "removeCollider", identifier: this.id})
	this.physicsWorld.remove(this.id);

}

module.exports = Bomb;