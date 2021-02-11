class Player {
	constructor(player) {
		this.id = player.id;
        this.pos = new Vector2D(player.pos.x, player.pos.y);
        this.vel = new Vector2D(player.vel.x, player.vel.y);
		this.radius = player.radius;
		this.maxSpeed = player.maxSpeed;
		
		this.circle = two.makeCircle(player.pos.x, player.pos.y, this.radius);
		this.name = two.makeText(this.id, player.pos.x, player.pos.y - 10);
	}

	update(data) {
		this.pos.set(data.pos.x, data.pos.y);
		this.vel.set(data.vel.x, data.vel.y);
	}

	estimate() {
		if (this.vel.magnitude() != 0) {
			this.pos.add(this.vel.magnitude(this.maxSpeed * (clientGame.physicsTimeStep / 1000)));
		}
	}

	useOwnInput() {
		if (clientIsMobile && mobileController.clickables[0].pointer.magnitude() != 0)
		{
			let tempv = new Vector2D(mobileController.clickables[0].pointer.x, mobileController.clickables[0].pointer.y);
			this.vel = tempv.magnitude(this.maxSpeed);
		} else {
			this.vel = new Vector2D(0,0)
	
			if (input.w) {
				this.vel.y += -1;
			}
			if (input.s) {
				this.vel.y += 1;
			}
			if (input.a) {
				this.vel.x += -1;
			}
			if (input.d) {
				this.vel.x += 1;
			}        
		}
    }
}