
class Player {
	constructor(player) {
		this.id = player.id;
		this.name = player.name;
        // this.pos = new Vector2D(player.pos.x, player.pos.y);
		this.angle = player.angle;

		// this.size = player.size;
		this.state = "playing";

		this.score = 0;
	}

	update(data) {
		// this.pos.set(data.pos.x, data.pos.y);
		// this.vel.set(data.vel.x, data.vel.y);
		this.angle = data.angle;
	}

	estimate() {
		if (this.vel.magnitude() != 0 && game.physicsTimeStep > 0) {
			this.pos.add(this.vel.magnitude(this.maxSpeed * (game.physicsTimeStep / 1000)));
		}
	}


	// projectile collision
	checkCollision() {
	}

	getCell() {
    }

	// map collision
	mapCollisionEstimation() {
	}
}

Player.prototype.useOwnInput = function() {
	if (me.state == "playing") {
		if (clientIsMobile && mobileController.clickables[0].pointer.magnitude() != 0)
		{
			let tempv = new Vector2D(mobileController.clickables[0].pointer.x, mobileController.clickables[0].pointer.y);
			this.vel = tempv.magnitude(this.maxSpeed * m);
		} else {
			this.vel = new Vector2D(0,0)

			if (input.w) {
				this.vel.add(fromAngle(this.angle).magnitude(this.maxSpeed * (game.physicsTimeStep / 1000)));
			}
			if (input.s) {
				this.vel.add(fromAngle(this.angle).magnitude(-0.6 * this.maxSpeed * (game.physicsTimeStep / 1000)));
			}
			if (input.a) {
				this.angle -= this.angleSpeed * (game.physicsTimeStep / 1000);
			}
			if (input.d) {
				this.angle += this.angleSpeed * (game.physicsTimeStep / 1000);
			}
		}
	}
}