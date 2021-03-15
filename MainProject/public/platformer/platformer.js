class Platformer {
	constructor() {
		this.physicsTimeStep = 0;
		this.timeOfLastPhysicsEstimation = Date.now();
		this.isConnected = false;
		this.players = [];
	}
	
	buildGame(data) {
		this.timer = data.game.timer;
		this.round = data.game.round;
		this.totalRounds = data.game.totalRounds;

		for (let i = 0; i < data.game.players.length; i++) {
			this.players.syncNew(data.game.players[i], "player");
		}
		
		let index = game.players.findIndex(player => player.id === data.id);
		if (index != -1) {
			me = game.players[index];
		} else {
			console.log("ERROR: own player was not found!");
		}
		
		this.id = data.game.id;
		this.type = data.game.type;
		this.state = data.game.state;
		this.physicsWorld = new PhysicsWorld(data.game.physicsWorld);
		for (let i = 0; i < this.physicsWorld.colliders.length; i++) {
			this.makeObject(this.physicsWorld.colliders[i]);
		}
		character = scene.getObjectByName(me.id);
		animate();

		const material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});
		
		const points = [];
		points.push( new THREE.Vector3( 0, 0, 0 ) );
		points.push( new THREE.Vector3( 0, this.physicsWorld.chunkSize * -this.physicsWorld.worldSize.y , 0 ) );
		points.push( new THREE.Vector3( this.physicsWorld.chunkSize * this.physicsWorld.worldSize.x, this.physicsWorld.chunkSize * -this.physicsWorld.worldSize.y, 0 ) );
		points.push( new THREE.Vector3( this.physicsWorld.chunkSize * this.physicsWorld.worldSize.x, 0, 0 ) );
		points.push( new THREE.Vector3( 0, 0, 0 ) );
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		
		const line = new THREE.Line( geometry, material );
		scene.add( line );

	}

	makeObject(collider) {
		const geometry = new THREE.BoxGeometry(Math.abs(collider.vertexBuilder[0].x * 2), Math.abs(collider.vertexBuilder[0].y * 2), 1);

		// itemSize = 3 because there are 3 values (components) per vertex
		// geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		const material = new THREE.MeshStandardMaterial( { color: eval(collider.color) } );

		if (collider.type == "Sensor") {
			material.color.set(eval(collider.color));
			material.transparent = true;
			material.opacity = 0.5;
		} else if (collider.type == "PlayerCollider") {
			let playerCollider = new PlayerCollider(collider);
			// this.physicsWorld.add(playerCollider);
			material.color.set(eval(collider.color));
		} else if (collider.type == "Portal") {
			material.transparent = true;
			material.opacity = 0.4;
		} else if (collider.type == "ForceField") {
			material.transparent = true;
			material.opacity = 0.5;
		}


		const mesh = new THREE.Mesh( geometry, material );

		mesh.translateX(collider.pos.x);
		mesh.translateY(-collider.pos.y);

		mesh.name = collider.id.toString();

		scene.add(mesh);
	}

	loop() {
		let element = document.getElementById("timer");
		element.innerHTML = Math.round((game.timer - Date.now()) / 1000);
		element = document.getElementById("rounds");
		element.innerHTML = "Round " + (Math.abs(this.totalRounds - this.round)+1) + " / " + this.totalRounds;

		if (this.state == "playing") {
			this.physicsWorld.run();
			let object;
			for (let i = 0; i < game.physicsWorld.dynamicColliders.length; i++) {
				object = scene.getObjectByName(game.physicsWorld.dynamicColliders[i].id);
				if (object) {
					object.position.x = game.physicsWorld.dynamicColliders[i].pos.x;
					object.position.y = -game.physicsWorld.dynamicColliders[i].pos.y;
					object.position.z = 0;
				}
			}
			cameraLookAt();
		}
	}
}