class Tank {
	constructor(name, pos, vel, angle) {
		this.name = name;
		this.pos = pos;
		this.vel = vel;
		this.angle = angle;
		this.angleSpeed = 0;
		this.states = {forward: false, backward: false, left: false, right: false, shoot: false};

		this.rect = two.makeRectangle(this.pos.x, this.pos.y, 30, 18);
	}

	move(keys) {
		this.states = keys;
	}
	
	estimatePhysics() {
		this.pos.x += this.vel.x * timestep / 1000;
		this.pos.y += this.vel.y * timestep / 1000;
		this.angle += this.angleSpeed * timestep / 1000;
		// console.log(this.vel)
	}
}

class Projectile {
	constructor(pos, direction) {
		this.pos = pos;
        this.direction = direction;
		this.life = 100;
		
		this.circle = two.makeCircle(this.pos.x, this.pos.y, 5);
		this.circle.fill = '#000000';
	}
}