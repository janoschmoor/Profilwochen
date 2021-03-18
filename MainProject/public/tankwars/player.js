
class Player {
	constructor(player) {
		this.scope = 1.8;

		this.id = player.id;
		this.name = player.name;
        this.pos = new Vector2D(player.pos.x, player.pos.y);
        this.vel = new Vector2D(player.vel.x, player.vel.y);
		this.radius = player.radius;
		this.maxSpeed = player.maxSpeed;
		this.angle = player.angle;
		this.angleSpeed = player.angleSpeed;
		this.size = player.size;
		this.effects = player.effects;

		this.currentCell;

		this.maxAmmo = 0;
		this.currentAmmo = 0;
		this.state = player.state;
		this.health = player.health;
		this.weapon = player.weapon;
		this.collided = false;

		this.effects = player.effects;
		this.color = player.color;

		this.rect = two.makeRectangle(player.pos.x, player.pos.y, player.size.x, player.size.y);
		this.rect.fill = this.color;
		this.nameText = two.makeText(this.name, player.pos.x, player.pos.y - 40);

		this.barrel = two.makeRectangle(player.pos.x, player.pos.y, 25, 5);
		this.barrel.rotation = this.angle;

		this.turret = two.makeCircle(player.pos.x, player.pos.y, 6);
		this.turret.fill = "rgba(128, 128, 128, 1.0)";

		foreground.add(this.rect, this.nameText, this.lifeRectInner, this.lifeRectOuter, this.barrel, this.turret);
	}

	update(data) {
		this.pos.set(data.pos.x, data.pos.y);
		this.vel.set(data.vel.x, data.vel.y);
		this.health = data.health;
		this.angle = data.angle;
		this.kills = data.kills;
		this.maxAmmo = data.maxAmmo;
		this.currentAmmo = data.currentAmmo;
		if (this.health < 0) {
			this.health = 0;
		}
	}

	estimate() {
		if (this.vel.magnitude() != 0 && game.physicsTimeStep > 0) {
			let m = 1;
			if (this.effects.speed.bool) {
				m = 2;
			} else if (this.effects.slowdown.bool) {
				m = 0.25;
			}
			this.pos.add(this.vel.magnitude(this.maxSpeed * (game.physicsTimeStep / 1000) * m));
		}
		this.rect.rotation = this.angle;

		if (0.95 < Math.random()) {
			let shape = {
				type: "circle",
				stroke: false,
				radius: 2 + Math.random() * 2
			}
			let dir = fromAngle(this.angle + (Math.random() - 0.5)).magnitude(-20);
			let pos = new Vector2D(this.pos.x, this.pos.y).add(dir);
			if (this.vel.magnitude() == 0) {
				game.particles.push(new Particle(shape, "rgba(139, 69, 19, 0.4)", 20, pos, new Vector2D(0,0), 0.01, 0.95));
			} else {
				game.particles.push(new Particle(shape, "rgba(139, 69, 19, 0.4)", 20, pos, dir.magnitude(2), 0.01, 0.95));
			}
		}
		if (this.health < 20 && 0.9 < Math.random()) {
			let shape = {
				type: "rect",
				stroke: true,
				size: new Vector2D(Math.random() * 2 + 3, Math.random() * 3 + 2)
			}
			let vel = new Vector2D(Math.random() * 10 - 5, Math.random() * 10 - 5);
			let pos = new Vector2D(this.pos.x, this.pos.y).add(vel);
			game.particles.push(new Particle(shape, this.rect.fill, 30, pos, vel, 10, 0.85));
		}
	}


	// projectile collision
	checkCollision() {
		for (let i = 0; i < game.projectiles.length; i++) {
			let pos = new Vector2D(this.pos.x, this.pos.y)
			let dist = Math.abs(pos.sub(game.projectiles[i].pos).magnitude());
			let radiusTotal = this.size.x / 2 + game.projectiles[i].radius;
			if (dist < radiusTotal) {
				input.collision = {id: game.projectiles[i].id};
				socket.emit("clientUpdate", input);
				delete input.collision;
				game.projectiles.syncDelete(game.projectiles[i].id, "projectile");
			}
		}
	}

	getCell() {
        let vec = new Vector2D(Math.floor(this.pos.x / game.map.cellSize), Math.floor(this.pos.y / game.map.cellSize));
        if (vec.x >= 0 && vec.x < game.map.size.x && vec.y >= 0 && vec.y < game.map.size.y) {
            return vec;
        } else {
            return false;
        }
    }

	// map collision
	mapCollisionEstimation() {
		this.currentCell = this.getCell();
        let fractionAngle = Math.atan(this.size.y / this.size.x);
        let mag = Math.sqrt((this.size.x/2) * (this.size.x/2) + (this.size.y/2) * (this.size.y/2));
        let corners = [
            new Vector2D(this.pos.x, this.pos.y).add(fromAngle(this.angle + fractionAngle).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(fromAngle(this.angle - fractionAngle).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(fromAngle(this.angle + fractionAngle + Math.PI).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(fromAngle(this.angle - fractionAngle + Math.PI).magnitude(mag))
        ]
        for (let i = 0; i < 4; i++) { // for all 4 corners
            let corner = corners[i];
            let cell = new Vector2D(Math.floor(corner.x / game.map.cellSize), Math.floor(corner.y / game.map.cellSize));
            if (cell.x >= -1 && cell.x < game.map.size.x + 1 && cell.y >= -1 && cell.y < game.map.size.y + 1) {
                if (cell.x != this.currentCell.x || cell.y != this.currentCell.y) { // true: collision
                    
                    if (cell.x > this.currentCell.x) { // is right
                        if (game.map.cells[this.currentCell.x][this.currentCell.y].walls[1] == true) {
                            this.pos.x -= corner.x - game.map.cellSize * (this.currentCell.x + 1 );
                        }
                    }
                    if (cell.x < this.currentCell.x) { // is left
                        if (game.map.cells[this.currentCell.x][this.currentCell.y].walls[3] == true) {
                            this.pos.x += game.map.cellSize * (this.currentCell.x) - corner.x;
                        }
                    }
                    if (cell.y > this.currentCell.y) { // is down
                        if (game.map.cells[this.currentCell.x][this.currentCell.y].walls[2] == true) {
                            this.pos.y -= corner.y - game.map.cellSize * (this.currentCell.y + 1 );
                        }
                    }
                    if (cell.y < this.currentCell.y) { // is up
                        if (game.map.cells[this.currentCell.x][this.currentCell.y].walls[0] == true) {
                            this.pos.y += game.map.cellSize * (this.currentCell.y) - corner.y;
                        }
                    }

                }
            }
            
        }
    }
}

Player.prototype.useOwnInput = function() {
	if (me.state == "playing") {
		let m = 1;
		if (this.effects.speed.bool) {
			m = 2;
		} if (this.effects.slowdown.bool) {
			m = 0.25;
		}
		if (clientIsMobile && mobileController.clickables[0].pointer.magnitude() != 0)
		{
			let tempv = new Vector2D(mobileController.clickables[0].pointer.x, mobileController.clickables[0].pointer.y);
			this.vel = tempv.magnitude(this.maxSpeed * m);
		} else {
			this.vel = new Vector2D(0,0)

			if (input.w) {
				this.vel.add(fromAngle(this.angle).magnitude(this.maxSpeed * (game.physicsTimeStep / 1000) * m));
			}
			if (input.s) {
				this.vel.add(fromAngle(this.angle).magnitude(-0.6 * this.maxSpeed * (game.physicsTimeStep / 1000) * m));
			}
			if (input.a) {
				this.angle -= this.angleSpeed * (game.physicsTimeStep / 1000) * m;
			}
			if (input.d) {
				this.angle += this.angleSpeed * (game.physicsTimeStep / 1000) * m;
			}
		}
	}
}