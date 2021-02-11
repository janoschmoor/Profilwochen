let elem = document.getElementById('display');
let params = {width : window.outerWidth, height : window.outerHeight};
var two = new Two(params).appendTo(elem);

connect();

let time;
let timestep;
self = new Tank('name', 100, 100, 5);
let tempkeys = {forward: false, backward: false, left: false, right: false, shoot: false, shift: false};
let background = two.makeRectangle(0, 0, window.outerWidth, window.outerHeight);
background.noStroke();

document.addEventListener('keydown', function(event) {
	if (event.key == 'w' || event.key == 'W') {
		tempkeys.forward = true;
	} else if (event.key == 's' || event.key == 'S') {
		tempkeys.backward = true;
	} else if (event.key == 'a' || event.key == 'A') {
		tempkeys.left = true;
	} else if (event.key == 'd' || event.key == 'D') {
		tempkeys.right = true;
	} else if (event.key == ' ') {
		tempkeys.shoot = true;
		if (projectiles.length > 10) {
			two.remove(projectiles[0].circle);
			projectiles.splice(projectiles.length - 1, 1);
		}
	} else if (event.key == 'Enter') {
		background.fill = 'rgba(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ', 1)'; 
	} else if (event.key == 'Shift') {
		tempkeys.shift = true;
	}
	self.move(tempkeys);
})

document.addEventListener('keyup', function(event) {
	if (event.key == 'w' || event.key == 'W') {
		tempkeys.forward = false;
	} else if (event.key == 's' || event.key == 'S') {
		tempkeys.backward = false;
	} else if (event.key == 'a' || event.key == 'A') {
		tempkeys.left = false;
	} else if (event.key == 'd' || event.key == 'D') {
		tempkeys.right = false;
	} else if (event.key == ' ') {
		tempkeys.shoot = false;
	} else if (event.key == 'Shift') {
		tempkeys.shift = false;
	}
	self.move(tempkeys);
})


two.bind('update', function() {
	timestep = Date.now() - time;
	time = Date.now();
	
	for (let i = 0; i < tanks.length; i++) {

		tanks[i].estimatePhysics();

		tanks[i].rect.translation.set(tanks[i].pos.x, tanks[i].pos.y);
		tanks[i].rect.rotation = tanks[i].angle;
	}

	for (let j = 0; j < projectiles.length; j++) {
		projectiles[j].circle.translation.set(projectiles[j].pos.x, projectiles[j].pos.y);
	}

	socket.emit('clientUpdate', self.states);
});

two.play();