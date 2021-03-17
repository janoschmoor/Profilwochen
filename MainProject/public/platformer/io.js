let socket;
let me;
let serverTime;
let clientIsMobile = false;

function connect() {
	socket = io.connect("192.168.1.110:3000");

	socket.emit('establishConnection', {
		gameType: "Platformer",
		isMobile: clientIsMobile
	});

	socket.on('serverUpdate',
		function(data) {
			if (!bGameOver) {
				for (let i = 0; i < data.colliderUpdates.length; i++) {
					let object = scene.getObjectByName(data.colliderUpdates[i].id.toString());
					if (object) {
						object.position.x = data.colliderUpdates[i].pos.x;
						object.position.y = -data.colliderUpdates[i].pos.y;
						object.rotation.z = -data.colliderUpdates[i].angle;
					}
					let index = game.physicsWorld.colliders.findIndex(collider => collider.id === data.colliderUpdates[i].id);
					if (index != -1) {
						game.physicsWorld.colliders[index].pos = new Vector2D(data.colliderUpdates[i].pos.x, data.colliderUpdates[i].pos.y);
						if (data.colliderUpdates[i].vel) {
							game.physicsWorld.colliders[index].vel = new Vector2D(data.colliderUpdates[i].vel.x, data.colliderUpdates[i].vel.y);
							game.physicsWorld.colliders[index].angularVel = data.colliderUpdates[i].angularVel;
							// game.physicsWorld.colliders[index].angle = ;
							game.physicsWorld.colliders[index].setAngle(data.colliderUpdates[i].angle);
						}
					}
				}
				cameraLookAt();
				for (let i = 0; i < data.specials.length; i++) {
					if (data.specials[i].type == "changeGameState") {
						if (data.specials[i].round) {
							game.round = data.specials[i].round;
						}
						game.state = data.specials[i].state;
						game.timer = data.specials[i].endTime;
						if (game.state == "playing" || game.state == "building") {
							for (let i = 0; i < game.players.length; i++) {
								game.players[i].state = game.state;
							}
						}
					} else if (data.specials[i].type == "playerDied") {
						let index = game.players.findIndex(player => player.id === data.specials[i].id);
						if (index != -1) {
							game.players[index].state = "dead";
						}
					} else if (data.specials[i].type == "newCollider") {
						game.makeObject(data.specials[i].data);
					} else if (data.specials[i].type == "playerScores") {
						for (let j = 0; j < data.specials[i].data.length; j++) {
							let index = game.players.findIndex(player => player.id === data.specials[i].data[j].id)
							if (index != -1) {
								game.players[index].score = data.specials[i].data[j].score;
							}
						}
					} else if (data.specials[i].type == "removeCollider") {
						scene.remove(scene.getObjectByName(data.specials[i].identifier.toString()));
						game.physicsWorld.remove(data.specials[i].identifier);
					}
				}
			}
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
		}
	);

	socket.on('newPlayer',
		function(data) {
			game.makeObject(data.collider);
			game.players.syncNew(data, "player");
		}
	);

	socket.on('playerIsDead',
		function(data) {
			if (data == me.id)
			{
				me.state = "dead";
			}
			let index = game.players.findIndex(player => player.id == data);
			
		}
	);
	
	socket.on('playerRespawned',
		function(data) {
			if (data == me.id)
			{
				me.state = "playing";
			} else {
				let index = game.players.findIndex(player => player.id == data);
			}
		}
	);

	socket.on('removePlayer',
		function(data) {
			console.log("remove a player")
			scene.remove(scene.getObjectByName(data));
			game.players.syncDelete(data, "player");
		}
	);
	
	socket.on('gameOver',
		function(data) {
			
			// const loader = new THREE.FontLoader();

			// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
			// 	const geometry = new THREE.TextGeometry( data.highestHolder + " has won!", {
			// 		font: font,
			// 		size: 2,
			// 		height: 2,
			// 		curveSegments: 12,
			// 		bevelEnabled: true,
			// 		bevelThickness: 0.1,
			// 		bevelSize: 0.1,
			// 		bevelOffset: 0,
			// 		bevelSegments: 5
			// 	} );
			// 	const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
			// 	const mesh = new THREE.Mesh(geometry, material);

			// 	mesh.position.z = 20;
			// 	mesh.rotation.y = Math.PI;

			// 	mesh.name = "text";
			// 	scene.add(mesh);

			// 	let text = scene.getObjectByName("text");
			let element = document.getElementById("gameover");
			// element.innerHTML = data.highestHolder + " has won!";
			// console.log(data);
			if (data.id == me.id) {
				element.innerHTML = "You won the game!";
			} else {
				let temp = game.players.findIndex(player => player.id == data.id);
				if (temp != -1) {
					element.innerHTML = game.players[temp].name + " won the game!";
				} else {
					element.innerHTML = "Nobody won the game";
				}
			}
			
			let element2 = document.getElementById("gameovercontrols");
			element2.innerHTML = "Press Space or Enter to reload, Press Escape to return to the lobby";

			// camera.position.set(text.position.x - 15, text.position.y, text.position.z - 20);
			// camera.lookAt(text.position.x - 15, text.position.y, text.position.z);
			bGameOver = true;
		}
	);
}

