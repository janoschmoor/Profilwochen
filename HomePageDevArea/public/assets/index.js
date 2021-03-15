
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// const controls = new OrbitControls( camera, renderer.domElement );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );


    sphere.position.x = sphereBody.position.x;
    sphere.position.y = sphereBody.position.y;
    sphere.position.z = sphereBody.position.z;

    renderer.render( scene, camera );
};

animate();



// Setup our world
var world = new CANNON.World();
world.gravity.set(0, 0, -9.82); // m/s²


var fixedTimeStep = 1.0 / 60.0; // seconds
var maxSubSteps = 3;

// Start the simulation loop
var lastTime;
(function simloop(time){
  requestAnimationFrame(simloop);
  if(lastTime !== undefined){
     var dt = (time - lastTime) / 1000;
     world.step(fixedTimeStep, dt, maxSubSteps);
  }
//   console.log("Sphere z position: " + sphereBody.position.z);
//   camera.position.z = sphereBody.position.z
  lastTime = time;
})();


var sphereBody;
var sphere;

makeSphere();
makePlane();