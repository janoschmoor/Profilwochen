var socket;
var game;
var me;
var serverTime;
var clientIsMobile = false;

function connect() {
	socket = io.connect('192.168.129.201:3000');
	socket.emit('establishConnection', {
		gameType: "Game",
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
			clientGame.timeOfLastPhysicsEstimation = Date.now() - 1; // -1 is important for game not chrashing (otherwise physicstimestep could be 0 in worst case scenario)
		}
	);

	socket.on('error',
		function(data) {
			console.log("ERROR: " + data);
		}
	);

	socket.on('game',
		function(data) {
			game = data.game;
			let temp = [];
			for (let i = 0; i < data.game.players.length; i++) {
				temp.push(new Player(data.game.players[i]));
			}

			game.players = temp;
			let index = game.players.findIndex(player => player.id === data.id);
			if (index != -1) {
				me = game.players[index];
			} else {
				console.log("ERROR: own player was not found!");
			}

			two.play();
		}
	);

	socket.on('newPlayer',
		function(data) {
			game.players.push(new Player(data));
		}
	);

	socket.on('removePlayer',
		function(data) {
			let index = game.players.findIndex(player => player.id == data);
			two.remove(game.players[index].circle);
			two.remove(game.players[index].name);
			game.players.splice(index, 1);
		}
	);
}
