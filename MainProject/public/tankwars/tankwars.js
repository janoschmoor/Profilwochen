class TankWars {
	constructor() {
		this.physicsTimeStep = 0;
		this.timeOfLastPhysicsEstimation = Date.now();
		this.isConnected = false;
		this.players = [];
		this.projectiles = [];
		this.particles = [];

		this.toggleLeaderBoard = false;
		this.leaderBoardCreated = false;
		this.lbRects = [];
		this.lbTexts = [];

		this.alive = 0;
		this.showControls = true;
	}
	
	buildGame(data) {
		
		for (let i = 0; i < data.game.players.length; i++) {
			this.players.syncNew(data.game.players[i], "player");
		}
		
		let index = game.players.findIndex(player => player.id === data.id);
		if (index != -1) {
			me = game.players[index];
			me.lifeRectOuter = two.makeRectangle(window.innerWidth / 2, window.innerHeight - 20, 800, 20);
			me.lifeRectOuter.fill = "rgba(32, 32, 32, 0.8)";

			me.lifeRectInner = two.makeRectangle(window.innerWidth / 2, window.innerHeight - 20, 798, 16);
			me.lifeRectInner.fill = "rgba(255, 0, 0, 1)";

		} else {
			console.log("ERROR: own player was not found!");
		}
		
		this.id = data.game.id;
		this.type = data.game.type;
		this.state = data.game.state;
		this.map = new Map(data.game.map);

		// this.mapRect = two.makeRectangle(this.map.plane.x, this.map.plane.y, this.map.plane.width * me.scope, this.map.plane.height * me.scope);
		// this.mapRect.fill = "rgba(0, 0, 0, 0.5)";
		// background.add(this.mapRect);
	}

	loop(xOffset, yOffset) {

		game.map.render(xOffset, yOffset);
		
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].rect.scale = me.scope;
			this.players[i].barrel.scale = me.scope;
			this.players[i].turret.scale = me.scope;
			
			this.players[i].rect.translation.set(xOffset + this.players[i].pos.x * me.scope, yOffset + this.players[i].pos.y * me.scope);
			this.players[i].barrel.translation.set(xOffset + this.players[i].pos.x * me.scope + Math.cos(this.players[i].angle) * me.scope * 8, yOffset + this.players[i].pos.y * me.scope + Math.sin(this.players[i].angle) * me.scope * 8);
			this.players[i].turret.translation.set(xOffset + this.players[i].pos.x * me.scope, yOffset + this.players[i].pos.y * me.scope);
			this.players[i].nameText.translation.set(xOffset + this.players[i].pos.x * me.scope, yOffset + this.players[i].pos.y * me.scope - 10);
			
			this.players[i].barrel.rotation = this.players[i].angle;

			if (!this.players[i].effects.freeze.bool) {
				this.players[i].estimate();
				this.players[i].mapCollisionEstimation();
			} else {
				this.players[i].rect.fill = "rgba(175, 175, 175, 0.5)";
				this.players[i].barrel.fill = "rgba(255, 255, 255, 0.5)";
				this.players[i].turret.fill = "rgba(128, 128, 128, 0.5)";
			}
			
			
			if (this.toggleLeaderBoard && !this.leaderBoardCreated) {
				this.lbRects.push(two.makeRectangle(window.innerWidth / 2, window.innerHeight / 3 + i * 20, 500, 20));
				this.lbTexts.push(two.makeText(this.players[i].name + ": " + this.players[i].kills, window.innerWidth / 2, window.innerHeight / 3 + i * 20));
				this.lbRects[i].fill = "rgba(55, 55, 55, 0.75)";
				this.lbTexts[i].fill = "rgba(200, 200, 200, 0.75)";
			} else if (!this.toggleLeaderBoard && this.leaderBoardCreated) {
				two.remove(this.lbRects);
				two.remove(this.lbTexts);
				this.lbRects = [];
				this.lbTexts = [];
				this.leaderBoardCreated = false;
			}
		}
		
		if (this.toggleLeaderBoard && !this.leaderBoardCreated) {
			this.leaderBoardCreated = true;
		}

		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].collision();
			this.projectiles[i].estimate();
			this.projectiles[i].circle.scale = me.scope;
			this.projectiles[i].circle.translation.set(xOffset + this.projectiles[i].pos.x * me.scope, yOffset + this.projectiles[i].pos.y * me.scope);
		}

		for (let i = this.particles.length - 1; i >= 0; i--) {
			this.particles[i].update(xOffset, yOffset);
			if (this.particles[i].life <= 0) {
				two.remove(this.particles[i].display);
				foreground.remove(this.particles[i].display);
				this.particles.splice(i, 1);
			}
		}

		if (game.state == "running") {
			me.checkCollision();
		}
	}
}