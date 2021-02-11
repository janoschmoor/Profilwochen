var socket;
var tanks = [];
var projectiles = [];

// array of tanks on the client side

function connect() {
    socket = io.connect('192.168.129.178:3000');

    listen();

	socket.emit('connectToGame');
}


function listen() {
	socket.on('gameData',
		function(data) {
			for (let i = 0; i < data.players.length; i++) {
				let player = data.players[i];
				tanks.push(new Tank(player.id, player.pos, player.vel, player.angle));
			}
        }
	);

	socket.on('serverUpdate',
		function(data) {
			for (let i = 0; i < tanks.length; i++) {
				tanks[i].pos = data.playerUpdates[i].pos;
				tanks[i].vel = data.playerUpdates[i].vel;
				tanks[i].angle = data.playerUpdates[i].angle;
				tanks[i].angleSpeed = data.playerUpdates[i].winkelgeschwindigkeit;
			}

			for (let i = 0; i < projectiles.length; i++) {
				projectiles[i].pos = data.projectileUpdates[i].pos;
			}
		}
	);

	socket.on('newClient',
		function(data) {
			tanks.push(new Tank(data.id, data.pos, data.vel, data.angle));
		}
	);
	socket.on('newProjectile',
		function(data) {
			projectiles.push(new Projectile(data.pos, data.direction));
		}
	);

	socket.on('deleteClient',
		function(id) {
			let index = tanks.findIndex(tank => tank.name === id);
			if (index >= 0) {
				two.remove(tanks[index].rect);
				tanks.splice(index, 1);
			}
		}
	);
}