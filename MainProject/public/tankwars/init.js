// -------------------------------------- TWO JS --------------------------------------

let elem = document.getElementById('twoCanvas');
let params = {width: window.innerWidth, height: window.innerHeight};
let two = new Two(params).appendTo(elem);
let input = {};
let font = "Copperplate";

let background = two.makeGroup();
let foreground = two.makeGroup();

let weaponText = two.makeText("", window.innerWidth - 200, window.innerHeight - 20);
let ControlText1 = two.makeText("W: Forward  S: Backward  A: Rotate left  D: Rotate Right", window.innerWidth - window.innerWidth / 1.2, window.innerHeight - 100);
let ControlText2 = two.makeText("Press Space to shoot", window.innerWidth - window.innerWidth / 1.2, window.innerHeight - 80);

let cta = 0;
let st = true;

ControlText1.scale = 1.4;
ControlText2.scale = 1.4;
ControlText1.family = font;
ControlText2.family = font;



weaponText.scale = 2;
weaponText.family = font;

// -------------------------------------- TWO JS --------------------------------------

let bGameOver = false;

// -------------------------------------- EVENTS --------------------------------------

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
		if (event.key == ' ') {
			input.shoot = true;
		}
		if (event.key == "Tab") {
			event.preventDefault();
			game.toggleLeaderBoard = true;
		}
		if (event.key == " ") {
			if (bGameOver) {
				location.reload();
			}
		}
		if (event.key == "Escape") {
			if (bGameOver) {
				location.replace("/");
			}
		}
		socket.emit('clientUpdate', input);
    }
);

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
		if (event.key == ' ') {
			input.shoot = false;
		}
		if (event.key == "Tab") {
			game.toggleLeaderBoard = false;
		}
		input.collision = me.collision;
		socket.emit('clientUpdate', input);
	}
);

document.addEventListener('click',
	function(event) {
		if (!clientIsMobile) {
			let x = window.innerWidth / 2;
			let y = window.innerHeight / 2;
			let w = window.innerWidth / 1.5;
			let h = window.innerHeight / 5;
			if (me.state == "respawning" && event.x > x - w && event.x < x + w && event.y > y - h && event.y < y + h) {
				me.state = "playing";
				input.state = "respawn";
				socket.emit("clientUpdate", input);
				delete input.state;
			}
		}

		if(bGameOver) {
			let x = window.innerWidth / 2;
			let y = window.innerHeight - window.innerHeight / 3;
			let w = window.innerWidth / 3;
			let h = window.innerHeight / 5;
			console.log("game is over");
			if (event.x > x - w && event.x < x + w && event.y > y - h && event.y < y + h) {
				location.reload();
			}
		}
	}
);

document.addEventListener('resize',
	function() {
		two.width = window.innerWidth;
		two.height = window.innerHeight;
	}
);

// -------------------------------------- EVENTS --------------------------------------

two.bind('update',
	function(frameCount) {
		if (!document.hasFocus()) {
			input.state = "dead";
			socket.emit("clientUpdate", input);
			delete input.state;
		}

		if (st) {
			cta += 1;
			if (cta >= 1200) {
				st = false;
				two.remove(ControlText1, ControlText2);
			}
		}

		let xOffset = -(me.pos.x * me.scope - window.innerWidth / 2);
		let yOffset = -(me.pos.y * me.scope - window.innerHeight / 2);
		
		me.lifeRectInner.vertices[1].x = (me.health / 100) * 798 - 399;
		me.lifeRectInner.vertices[2].x = (me.health / 100) * 798 - 399;

		weaponText.value = hud.weapon.name + "  " + me.currentAmmo + " / " + me.maxAmmo;

		game.physicsTimeStep = Date.now() - game.timeOfLastPhysicsEstimation;
		me.useOwnInput();

		game.loop(xOffset, yOffset);

		game.timeOfLastPhysicsEstimation = Date.now();

		if (clientIsMobile) {
			input.pointer = mobileController.clickables[0].pointer;
			socket.emit('clientUpdate', input);
		}
	}
);

var game = new TankWars();

if (clientIsMobile == true) {
	initMobileController(); // this function is specific to each different game
}

connect();