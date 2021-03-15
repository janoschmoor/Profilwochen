const Sensor = require("./sensor");
const Vector2D = require("../lib/vector2d");

class ForceField extends Sensor{
	constructor(physicsWorld, id, color, pos, vertexBuilder, angle = 0, mass = 0) {
		super(physicsWorld, id, color, pos, vertexBuilder, "");

		this.isActive = false;
		this.force = new Vector2D(Math.random() - 0.5, Math.random() - 0.5).magnitude(Math.random() * 1 + 1);

		this.type = this.constructor.name;
	}
}

ForceField.prototype.collisionDetected = function(id) {
	let index = this.physicsWorld.colliders.findIndex(c => c.id == id);
	if (index != -1) {
        this.physicsWorld.colliders[index].vel.add(this.force);
	}
}

module.exports = ForceField;