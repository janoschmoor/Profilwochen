import * as THREE from '/build/three.module.js';
import {GLTFLoader} from '/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '/jsm/loaders/OBJLoader.js';

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


const light1 = new THREE.PointLight( 0xffffff, 3, 10000 );
const light2 = new THREE.PointLight( 0xffffff, 3, 10000 );
const light3 = new THREE.PointLight( 0xffffff, 3, 10000 );
const light4 = new THREE.PointLight( 0xffffff, 3, 10000 );

light1.position.set( 0, 100, 0 );
light2.position.set( 100, 0, 0 );
light3.position.set( -100, 0, 0 );
light4.position.set( 0, -100, 0 );

scene.add( light1, light2, light3, light4 );

loader.load(
    './janoschkopf.gltf',
    function(obj) {
        scene.add(obj.scene);

        // scene.getObjectByName('Cube').receiveShadow = true;

        // scene.getObjectByName('4Story').castShadow = true;
        // scene.getObjectByName('4Story_Wide_2Doors_Roof').castShadow = true;
        // scene.getObjectByName('6Story_Stack').castShadow = true;
        // scene.getObjectByName('4Story').receiveShadow = true;
        // scene.getObjectByName('4Story_Wide_2Doors_Roof').receiveShadow = true;
        // scene.getObjectByName('6Story_Stack').receiveShadow = true;

        // console.log(scene);
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

// let velocity = 0.25;
// let direction = 1;


const animate = function () {
    requestAnimationFrame( animate );
    
    // if ( light.position.x < -100)
    // {
    //     direction = 1;
    // }
    // if (light.position.x > 100) {
    //     direction = -1;
    // }
    
    // light.position.x += direction * velocity;
    // light.position.z += direction * velocity;
    
    controls.update();
    renderer.render( scene, camera );
};

animate();