let elem = document.getElementById('twoCanvas');
let params = {width: window.innerWidth, height: window.innerHeight};
let two = new Two(params).appendTo(elem);
let input = {};

let rect = two.makeRectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight);
rect.noStroke();
rect.fill = "#a0a0a0";

let text = two.makeText('', 800, 800);
text.noStroke();
text.fill = '#000000'
text.value = window.innerWidth + ", " + window.innerHeight;


document.addEventListener('keydown',
	function(event) {
		if (event.key == 'w' || event.key == 'W') {
			input.w = true;
		}
		if (event.key == 's' || event.key == 'S') {
			input.s = true;
		}
		if (event.key == 'a' || event.key == 'A') {
			input.a = true;
		}
		if (event.key == 'd' || event.key == 'D') {
			input.d = true;
		}
		socket.emit('clientUpdate', input);
    }
)

document.addEventListener('keyup',
	function(event) {
		if (event.key == 'w' || event.key == 'W') {
			input.w = false;
		}
		if (event.key == 's' || event.key == 'S') {
			input.s = false;
		}
		if (event.key == 'a' || event.key == 'A') {
			input.a = false;
		}
		if (event.key == 'd' || event.key == 'D') {
			input.d = false;
		}
		socket.emit('clientUpdate', input);
})

document.addEventListener('resize',
	function() {
		two.width = window.innerWidth;
		two.height = window.innerHeight;
		
	})

two.bind('update', function(frameCount) {

	me.useOwnInput();
	clientGame.physicsTimeStep = Date.now() - clientGame.timeOfLastPhysicsEstimation;
	for (let i = 0; i < game.players.length; i++) {
		game.players[i].estimate();
		game.players[i].circle.translation.set(game.players[i].pos.x, game.players[i].pos.y);
		game.players[i].name.translation.set(game.players[i].pos.x, game.players[i].pos.y - 10);
	}
	clientGame.timeOfLastPhysicsEstimation = Date.now();

	if (clientIsMobile) {
		input.pointer = mobileController.clickables[0].pointer;
		socket.emit('clientUpdate', input);
	}
})

class ClientGame {
	constructor() {
		this.physicsTimeStep = 0;
		this.timeOfLastPhysicsEstimation = Date.now();

	}
}

var clientGame = new ClientGame();

if (clientIsMobile == true) {
	initMobileController(); // this function is specific to each different game
	window.scrollTo(0, 1);
}

connect();