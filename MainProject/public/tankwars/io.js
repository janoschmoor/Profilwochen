
let socket;
let me;
let serverTime;
let clientIsMobile = false;
let hud = {weapon : {name: "TankWarsWeapon"}};

function connect() {
	socket = io.connect("192.168.129.241:3000");

	socket.emit('establishConnection', {
		gameType: "TankWars",
		isMobile: clientIsMobile
	});

	socket.on('serverUpdate',
		function(data) {
			let index;
			for (let i = 0; i < data.playerUpdates.length; i++) {
				index = game.players.findIndex(player => player.id === data.playerUpdates[i].id)
				if (index != -1) {
					game.players[index].update(data.playerUpdates[i]);
				}
			}

			for (let i = 0; i < data.projectileUpdates.length; i++) {
				index = game.projectiles.findIndex(projectile => projectile.id == data.projectileUpdates[i].id)
				if (index != -1) {
					game.projectiles[index].update(data.projectileUpdates[i]);
				}
			}

			for (let i = 0; i < data.specials.length; i++) {
				if (data.specials[i].type == "newWeapon") {
					if (data.specials[i].id == me.id) {
						hud.weapon = data.specials[i].weapon;
						hud.tier = data.specials[i].tier;
						// me.scope = 3 - 1 / (data.specials[i].tier / (data.specials[i].tier + 1));
						me.scope = 1.8 - (data.specials[i].tier * 0.3 - 0.3);
					}
				} else if (data.specials[i].type == "shootParticle") {
					for (let j = 0; j < 8; j++) {
						let shape = {
							type: "circle",
							stroke: false,
							radius: Math.random() * 2 + 1
						};
						let pos = new Vector2D(data.specials[i].pos.x, data.specials[i].pos.y).add(new Vector2D(data.specials[i].dir.x, data.specials[i].dir.y).magnitude(20));
						let vel = new Vector2D(data.specials[i].dir.x + Math.random() / 2 - 0.25, data.specials[i].dir.y + Math.random() / 2 - 0.25).magnitude(6 + 3 * Math.random());
						game.particles.push(new Particle(shape, "rgba(80, 80, 80, 0.5)", 20, pos, vel, 0.1, 0.85));
					}
				} else if (data.specials[i].type == "gameStateChange") {
					game.state = "running";
					for (let i = game.projectiles.length - 1; i >= 0; i--) {
						game.projectiles.syncDelete(game.projectiles[i].id, "projectile");
					}
				} else if (data.specials[i].type == "endFreeze") {
					let index = game.players.findIndex(player => player.id == data.specials[i].id);
					game.players[index].effects.freeze.bool = false;
					game.players[index].state = "playing";
					game.players[index].rect.fill = game.players[index].color;
					game.players[index].barrel.fill = "#ffffff";
					game.players[index].turret.fill = "rgba(128, 128, 128, 1.0)";
				} else if (data.specials[i].type == "projectileHit") {
					for (let j = 0; j < 6; j++) {
						let shape = {
							type: "rect",
							stroke: true,
							size: new Vector2D(Math.random() * 5 + 1, Math.random() * 5 + 1)
						};
		
						let pos = new Vector2D(data.specials[i].pos.x, data.specials[i].pos.y);
						let dir = new Vector2D(data.specials[i].dir.x, data.specials[i].dir.y).magnitude(10);
						dir.x += Math.random()*5-2.5;
						dir.y += Math.random()*5-2.5;
						let vel = dir.magnitude(1 + 3 * Math.random());
						game.particles.push(new Particle(shape, data.specials[i].color, 25, pos, vel, 1, 0.9));
					}
				} else if (data.specials[i].type == "suicideBombExplosion") {
					let shape = {
						type: "circle",
						stroke: true,
						radius: data.specials[i].explosionRadius
					}
					let pos = new Vector2D(data.specials[i].pos.x, data.specials[i].pos.y);
					game.particles.push(new Particle(shape, "rgba( 255, 230, 230, 0.3)", 25, pos, new Vector2D(0,0), 0, 0));
				}  else if (data.specials[i].type == "startSlowdown") {
					let index = game.players.findIndex(player => player.id == data.specials[i].id);
					game.players[index].effects.slowdown.bool = true;
				}  else if (data.specials[i].type == "endSlowdown") {
					let index = game.players.findIndex(player => player.id == data.specials[i].id);
					game.players[index].effects.slowdown.bool = false;
				}  else if (data.specials[i].type == "startSpeed") {
					let index = game.players.findIndex(player => player.id == data.specials[i].id);
					game.players[index].effects.speed.bool = true;
				}	
			}
			game.timeOfLastPhysicsEstimation = Date.now();
		}
	);

	socket.on('error',
		function(data) {
			console.log("ERROR: " + data);
		}
	);

	socket.on('game',
		function(data) {
			game.buildGame(data);

			two.play();
		}
	);

	socket.on('newPlayer',
		function(data) {
			game.players.syncNew(data, "player");
		}
	);

	socket.on('newProjectile',
		function(data) {
			game.projectiles.syncNew(data, "projectile");
		}
	);

	socket.on('deleteProjectile',
		function(data) {
			game.projectiles.syncDelete(data, "projectile")
		}
	);

	socket.on('playerIsDead',
		function(data) {
			if (data == me.id)
			{
				me.state = "dead";
				me.effects.freeze.bool = true;
			}
			let index = game.players.findIndex(player => player.id == data);
			game.players[index].effects.freeze.bool = true;
			for (let j = 0; j < 25; j++) {
				let shape = {
					type: "rect",
					stroke: true,
					size: new Vector2D(Math.random() * 10 + 1, Math.random() * 10 + 1)
				};

				let pos = new Vector2D(game.players[index].pos.x, game.players[index].pos.y);
				let vel = new Vector2D(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5).magnitude(1 + 4 * Math.random());
				game.particles.push(new Particle(shape, `${game.players[index].rect.fill}`, 20 + Math.random() * 100, pos, vel, Math.random()*4-2, 0.9));
			}
		}
	);
	
	socket.on('playerRespawned',
		function(data) {
			if (data == me.id)
			{
				me.state = "playing";
				me.effects.freeze = false;
			} else {
				let index = game.players.findIndex(player => player.id == data);
				game.players[index].effects.freeze.bool = false;
			}
		}
	);

	socket.on('removePlayer',
		function(data) {
			game.players.syncDelete(data, "player")
		}
	);

	socket.on('gameOver',
		function(data) {
			// b=background go=gameOver gob=gameOverButton gobt=gameOverButtonText

			let b = two.makeRectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
			let go = two.makeText(`${data} has won`, window.innerWidth/ 2, window.innerHeight / 2.5);

			let gob = two.makeRectangle(window.innerWidth / 2, window.innerHeight - window.innerHeight / 2.5, window.innerWidth / 3, window.innerHeight / 5);
			let gobt = two.makeText("Reconnect", window.innerWidth / 2, window.innerHeight - window.innerHeight / 2.5);
			gobt.fill = "#000000";
			gobt.scale = 4;

			b.fill = "#000000";
			go.fill = "#ffffff";
			go.scale = 4;

			go.family = font;
			gobt.family = font;

			bGameOver = true;
		}
	);
}

