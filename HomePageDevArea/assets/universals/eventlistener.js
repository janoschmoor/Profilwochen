document.addEventListener('keydown',
	function(event) {
		if (event.key == 'w' || event.key == 'W') {
			camera.position.x += 1;
		}
		if (event.key == 's' || event.key == 'S') {
			camera.position.x -= 1;
		}
		if (event.key == 'a' || event.key == 'A') {
			camera.position.z += 1;
		}
		if (event.key == 'd' || event.key == 'D') {
			camera.position.z -= 1;
		}

    }
);
