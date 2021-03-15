const Collider = require("./collider");
const TurretProjectile = require("./turretprojectile");
const Vector2D = require("../lib/vector2d")
const Rectangle = require("./collisionshapes/rectangle")


class Turret extends Collider {
	constructor(physicsWorld, id, color, pos, vertexBuilder, owner, angle = 0, mass = 0) {
        super(physicsWorld, id, color, pos, vertexBuilder, angle = 0, mass = 0);

        this.owner = owner;

        this.direction = new Vector2D(Math.round(Math.random() * 2 - 1), Math.round(Math.random() * 2 - 1));
        if (this.direction.magnitude() == 0) {
            this.direction.x = 1;
        }

        // this.direction.set(1, 1);

        this.angle = this.direction.interiorAngle() + Math.PI / 2;

        this.buildVertecies();

        this.shootCooldown = 200;
        
        this.type = this.constructor.name;
	}
}

Turret.prototype.update = function() {
    this.shootCooldown --;
    if (this.shootCooldown < 0) {
        this.shootCooldown = 200;
        let collider = new TurretProjectile(this.physicsWorld, this.physicsWorld.nextColliderId, this.color, new Vector2D(this.pos.x + this.direction.x * 1.25, this.pos.y + this.direction.y * 1.25), new Rectangle(0.2, 0.2), this.owner, 0, this.direction._magnitude(15));
        this.physicsWorld.nextColliderId++;
        this.physicsWorld.add(collider);
		let index = this.physicsWorld.colliders.findIndex(collider => collider.type == "PlayerCollider");
        this.physicsWorld.colliders[index].reference.game.nextUpdate.specials.push({type: "newCollider", data: collider.returnSelf()});
    }
}

module.exports = Turret;