import * as THREE from '/build/three.module.js';
import {GLTFLoader} from '/jsm/loaders/GLTFLoader.js';
import {MTLLoader} from '/jsm/loaders/MTLLoader.js';

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
// const controls = new OrbitControls(camera, renderer.domElement);
const OBJloader = new OBJLoader();
const MTLloader = new MTLLoader();