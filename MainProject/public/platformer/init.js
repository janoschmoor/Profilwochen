let character;
let input = {w: false, s: false, a: false, d: false};
let inputControl = {w: true, s: true, a: true, d: true};
let bInput;
let bGameOver = false;
let lookAtIndex = 0;
// -------------------------------------- THREEJS -------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color(0x0099ff);

// -------------------------------------- THREEJS -------------------------------------

// -------------------------------------- EVENTS --------------------------------------

document.addEventListener('keydown',
	function(event) {
		if (event.key == "w" || event.key == "W") {
			if (input.w == false && inputControl.w == true) {
				bInput = true;
				input.w = true;
				inputControl.w == false;
			}
		}
		if (event.key == "s" || event.key == "S") {
			if (input.s == false && inputControl.s == true) {
				bInput = true;
				input.s = true;
				inputControl.s == false;
			}
		}
		if (event.key == "a" || event.key == "A") {
			if (input.a == false && inputControl.a == true) {
				bInput = true;
				input.a = true;
				inputControl.a == false;
			}
		}
		if (event.key == "d" || event.key == "D") {
			if (input.d == false && inputControl.d == true) {
				bInput = true;
				input.d = true;
				inputControl.d == false;
			}
		}
		if (event.key == " ") {
			if (bGameOver) {
				location.reload();
			}
		}
		if (event.key == "Enter") {
			if (bGameOver) {
				location.replace("");
			}
		}

		if (bInput) {
			socket.emit("clientUpdate", input);
		}
		bInput = false;
    }
);
document.addEventListener('keyup',
	function(event) {
		if (event.key == "w" || event.key == "W") {
			input.w = false;
			bInput = true;
			inputControl.w == true;
		}
		if (event.key == "s" || event.key == "S") {
			input.s = false;
			bInput = true;
			inputControl.s == true;
		}
		if (event.key == "a" || event.key == "A") {
			input.a = false;
			bInput = true;
			inputControl.a == true;
		}
		if (event.key == "d" || event.key == "D") {
			input.d = false;
			bInput = true;
			inputControl.d == true;
		}
		if (event.key == "Enter") {
			input.enter = true;
			bInput = true;
		}
		if (bInput) {
			socket.emit("clientUpdate", input);
		}
		input.enter = false;
		bInput = false;

		if (event.key == "ArrowLeft") {
			lookAtIndex -= 1;
			if (lookAtIndex < 0) {
				lookAtIndex = game.players.length - 1;
			}
		}
		if (event.key == "ArrowRight") {
			lookAtIndex += 1;
			if (lookAtIndex == game.players.length) {
				lookAtIndex = 0;
			}
		}
	}
);

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
light.name = "HSL";
scene.add( light );

let tv = new THREE.Vector3(0, 0, 0);

function cameraLookAt() {
	let object = 0;
	if (me.state == "dead" || me.state == "finished") {

		object = scene.getObjectByName(game.players[lookAtIndex].id);
		tv.set(object.position.x, 3 + object.position.y, 15 + object.position.z);
		camera.position.set(tv.x, tv.y, tv.z);
		camera.lookAt(object.position);

	} else {

		object = scene.getObjectByName(me.id);
		tv.set(object.position.x, 3 + object.position.y, 15 + object.position.z);
		camera.position.set(tv.x, tv.y, tv.z);
		camera.lookAt(object.position);

	}
}

// -------------------------------------- EVENTS --------------------------------------
function animate() {
	requestAnimationFrame( animate );

	game.loop();

	renderer.render( scene, camera );

	// try {
	// 	scene.children[4].rotation.z += 0.01;
	// } catch {

	// }
	
	// if (condition) {
		
	// }

	if(!bGameOver) {
		cameraLookAt();
	}

}

connect();
var game = new Platformer();
