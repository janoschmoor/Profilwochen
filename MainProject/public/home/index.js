import * as THREE from '/build/three.module.js';
import {GLTFLoader} from '/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xaaaaaa, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

const ambientLight = new THREE.AmbientLight(0xa0a0a0);

const light = new THREE.PointLight( 0xffffff, 3, 10000 );
light.position.set( 0, 25, 0 );
light.castShadow = true;


scene.add( light );
scene.add(ambientLight);

light.shadow.mapSize.width = 2048; // default
light.shadow.mapSize.height = 2048; // default
light.shadow.camera.near = 10; // default
light.shadow.camera.far = 200; // default

loader.load(
    '/cityfixed.gltf',
    function(gltf) {
        var model = gltf.scene;
        scene.add(model);

        scene.getObjectByName('Cube').receiveShadow = true;

        scene.getObjectByName('4Story').castShadow = true;
        scene.getObjectByName('4Story_Wide_2Doors_Roof').castShadow = true;
        scene.getObjectByName('6Story_Stack').castShadow = true;
        scene.getObjectByName('4Story').receiveShadow = true;
        scene.getObjectByName('4Story_Wide_2Doors_Roof').receiveShadow = true;
        scene.getObjectByName('6Story_Stack').receiveShadow = true;

        console.log(scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.log(error);
    }
)

camera.position.x = 22;
camera.position.y = 11;
camera.position.z = 7;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let velocity = 0.25;
let direction = 1;


const animate = function () {
    requestAnimationFrame( animate );
    
    if ( light.position.x < -100)
    {
        direction = 1;
    }
    if (light.position.x > 100) {
        direction = -1;
    }
    
    light.position.x += direction * velocity;
    light.position.z += direction * velocity;
    
    controls.update();
    renderer.render( scene, camera );
};

animate();