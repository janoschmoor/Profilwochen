import * as THREE from '/build/three.module.js';
import {GLTFLoader} from '/jsm/loaders/GLTFLoader.js';
import {MTLLoader} from '/jsm/loaders/MTLLoader.js';
import {OBJLoader} from '/jsm/loaders/OBJLoader.js';
// import {TextureLoader} from '/jsm/loaders/TextureLoader.js'

import {OrbitControls} from '/jsm/controls/OrbitControls.js';

import { EffectComposer } from '/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from '/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '/jsm/postprocessing/UnrealBloomPass.js';

// import {Howl, Howler} from '/howler/src/howler.core.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
const OBJloader = new OBJLoader();
const MTLloader = new MTLLoader();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ReinhardToneMapping;

// console.log(camera)

const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );
const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};
const params = {
    exposure: 10,
    bloomStrength: 15,
    bloomThreshold: 0,
    bloomRadius: 1,
    scene: "Scene with Glow"
};
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderPass );
bloomComposer.addPass( bloomPass );




const finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), "baseTexture"
);
finalPass.needsSwap = true;
const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderPass );
// const glitchPass = new GlitchPass();
// finalComposer.addPass( glitchPass );
finalComposer.addPass( finalPass );
function renderBloom( mask ) {

    if ( mask === true ) {

        scene.traverse( darkenNonBloomed );
        bloomComposer.render();
        scene.traverse( restoreMaterial );

    } else {

        camera.layers.set( BLOOM_SCENE );
        bloomComposer.render();
        camera.layers.set( ENTIRE_SCENE );

    }

}
function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(hemisphereLight);

const loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json',
    function ( font ) {
        let geometry = new THREE.TextGeometry("Tank Wars", {
            font: font,
            size: 25,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(100, -930, -200);
        
        mesh.name = "blackhole1text";
        scene.add(mesh);

        let geometry2 = new THREE.TextGeometry("Platformer", {
            font: font,
            size: 25,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const material2 = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const mesh2 = new THREE.Mesh(geometry2, material2);
        
        mesh2.position.set(100, 1070, 500);
        
        mesh2.name = "blackhole2text";
        scene.add(mesh2);
});


// + 30
// let blackhole1 = new Blackhole(new THREE.Vector3(100, -1000, -200));
// let blackhole2 = new Blackhole(new THREE.Vector3(100, 1000, 500));

function makeCube(color) {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshStandardMaterial({color: color});

    let mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(Math.random() * 0.1+0.1, Math.random() * 0.1+0.1, Math.random() * 0.1+0.1);

    mesh.layers.enable( BLOOM_SCENE );
    scene.add(mesh);
    return mesh;
}

function makeShot(pos, dir) {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshStandardMaterial({color: 0x00ff00});

    let mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(0.5, 0.5, 3.5);
    mesh.position.set(pos.x, pos.y, pos.z);
    let temp = new THREE.Vector3(dir.x, dir.y, dir.z);
    mesh.velocity = temp.setLength(10);
    mesh.life = 100;
    
    // let temp2 = new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10);
    let temp2 = new THREE.Vector3(mesh.position.x + mesh.velocity.x, mesh.position.y + mesh.velocity.y, mesh.position.z + mesh.velocity.z);
    mesh.lookAt(temp2);
    // mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

    scene.add(mesh);
    mesh.layers.enable( 1 );
    return mesh;
}


function makeSphere(radius, pos, color = 0xffff00) {
    const geometry = new THREE.SphereGeometry( radius, 32, 32 );
    const material = new THREE.MeshStandardMaterial( {color: color} );
    const sphere = new THREE.Mesh( geometry, material );

    sphere.position.set(pos.x, pos.y, pos.z);
    
    scene.add( sphere );
    // if ( Math.random() < 0.25 ) sphere.layers.enable( BLOOM_SCENE )
    return sphere;
}

function makeEngine(radius, pos, color = 0xffff00) {
    const geometry = new THREE.SphereGeometry( radius, 32, 32 );
    const material = new THREE.MeshStandardMaterial( {color: color} );
    const engine = new THREE.Mesh( geometry, material );

    engine.position.set(pos.x, pos.y, pos.z);

    scene.add( engine );
    return engine;
}

let spheres = [];
for (let i = 0; i < 50; i++) {
    spheres.push(makeSphere(Math.random()*10+10, new THREE.Vector3(Math.random()*1000, Math.random()*1000, Math.random()*1000)));
    
}

spheres.push(makeSphere(4000, new THREE.Vector3(0, 0, 8000), 0xff0000));
// spheres[spheres.length-1].layers.enable(BLOOM_SCENE);

var Character;
var Moon;

MTLloader.load('./home/models/character/Intergalactic_Spaceship-(Wavefront).mtl',
    function(materials) {
        materials.preload();

        OBJloader.setMaterials(materials);
        OBJloader.load('./home/models/character/Intergalactic Spaceship_Blender_2.79b_BI.obj', function(object) {
            Character = object;
            // Character.castShadow = true;
            // Character.recieveShadow = true;
            scene.add(Character);
            characterController = new CharacterController();
        });
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    undefined);
// MTLloader.load('./home/models/moon/moon.mtl',
//     function(materials) {
//         materials.preload();

//         OBJloader.setMaterials(materials);
//         OBJloader.load('./home/models/moon/moon.obj', function(object) {
//             Moon = object;
//             scene.add(Moon);
//         });
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     },
//     undefined);
// var map = new THREE.TextureLoader().load( "sprite.png" );
// var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
// var sprite = new THREE.Sprite( material );
// scene.add( sprite );



camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 40;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let dir = new THREE.Vector3(0, 0, 0);
let temp = new THREE.Vector3(0, 0, 0);
let tempC;
let tempBH;

const animate = function () {
    requestAnimationFrame( animate );

    try {
        tempC = new THREE.Vector3(0, 0, 0);
        tempBH = new THREE.Vector3(0, 0, 0);
        tempC.copy(Character.position);
        tempBH.copy(blackhole1.mesh.position);

        dir.subVectors(tempC, tempBH);
        dir.setLength(50);
        temp.addVectors(tempBH, dir);

        scene.getObjectByName("blackhole1text").lookAt(Character.position);
        scene.getObjectByName("blackhole1text").position.set(temp.x, temp.y, temp.z);


        tempC = new THREE.Vector3(0, 0, 0);
        tempBH = new THREE.Vector3(0, 0, 0);
        tempC.copy(Character.position);
        tempBH.copy(blackhole2.mesh.position);

        dir.subVectors(tempC, tempBH);
        dir.setLength(50);
        temp.addVectors(tempBH, dir);

        scene.getObjectByName("blackhole2text").lookAt(Character.position);
        scene.getObjectByName("blackhole2text").position.set(temp.x, temp.y, temp.z);

    } catch (error) {
        console.log(error);
    }
    
    if (characterController) {
        characterController.update();
        
        if (Character && blackhole1 && blackhole2) {
            blackhole1.update();
            if (Character.position.distanceTo(blackhole1.mesh.position) < blackhole1.mesh.geometry.parameters.radius) {
                location.replace("tankwars.html");
            }
            blackhole2.update();
            if (Character.position.distanceTo(blackhole2.mesh.position) < blackhole2.mesh.geometry.parameters.radius) {
                location.replace("platformer.html");
            }
        }
        // if (Character.position.distanceTo(blackhole1.position) < blackhole1.geometry.parameters.radius) {
        //     location.replace("tankwars.html");
        // }
    }

    // renderer.render( scene, camera );
    // composer.render();

    renderBloom( true );
    finalComposer.render();
};


var characterController;
var projectiles = [];

class CharacterController {
    constructor() {

        this.cameraLookAt = new THREE.Vector3(0,0,0);
        this.cameraPosition = new THREE.Vector3(10,0,0);

        this.cooldown = 10;

        this.controls = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
        }

        this.power = 0;
        this.direction;


        this.engine1 = makeEngine(0.4, new THREE.Vector3(0,0,0), 0x0000ff);
        this.engine1.position.set( 0, 0, 0 );
        this.engine1.emmitter = new ParticleEmmiter(this.engine1);
        scene.add( this.engine1 );


        this.engine2 = makeEngine(0.4, new THREE.Vector3(0,0,0), 0x0000ff);
        this.engine2.position.set( 0, 0, 0 );
        this.engine2.emmitter = new ParticleEmmiter(this.engine2);
        scene.add( this.engine2 );

		document.addEventListener("keydown",
		function(event) {
			if (event.key == "w" || event.key == "W") {
                characterController.controls.w = true;
			}
			if (event.key == "s" || event.key == "S") {
                characterController.controls.s = true;
			}
			if (event.key == "a" || event.key == "A") {
                characterController.controls.a = true;
			}
			if (event.key == "d" || event.key == "D") {
                characterController.controls.d = true;
			}
            if (event.key == "ArrowUp") {
                characterController.controls.up = true;
			}
            if (event.key == "ArrowDown") {
                characterController.controls.down = true;
            }
            if (event.key == "ArrowLeft") {
                characterController.controls.left = true;
			}
            if (event.key == "ArrowRight") {
                characterController.controls.right = true;
			}
            if (event.key == " ") {
                characterController.controls.space = true;
			}
		});

		document.addEventListener("keyup",
		function(event) {
			if (event.key == "w" || event.key == "W") {
                characterController.controls.w = false;
			}
			if (event.key == "s" || event.key == "S") {
                characterController.controls.s = false;
			}
			if (event.key == "a" || event.key == "A") {
                characterController.controls.a = false;
			}
			if (event.key == "d" || event.key == "D") {
                characterController.controls.d = false;
			}
            if (event.key == "ArrowUp") {
                characterController.controls.up = false;
			}
            if (event.key == "ArrowDown") {
                characterController.controls.down = false;
			}
            if (event.key == "ArrowLeft") {
                characterController.controls.left = false;
			}
            if (event.key == "ArrowRight") {
                characterController.controls.right = false;
			}
            if (event.key == " ") {
                characterController.controls.space = false;
			}
		});
	}

    update() {

        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].position.add(projectiles[i].velocity);
            projectiles[i].life --;

            for (let j = 0; j < spheres.length; j++) {
                if (spheres[j].position.distanceTo(projectiles[i].position) < spheres[j].geometry.parameters.radius) {
                    // scene.remove(spheres[j]);
                    // spheres.splice(j, 1);
                    spheres[j].layers.enable( 1 );
                }   
            }

            if (projectiles[i].life <= 0) {
                scene.remove(projectiles[i]);
                projectiles.splice(i, 1);
            }
        }

        if (this.cooldown > 0) {
            this.cooldown--;
        }
        if (this.controls.space && this.cooldown <= 0) {
            this.shoot();
        }

        this.updatePosition();
        this.updateLights();
        this.updateCamera();
    }

    updateCamera() {

        if (this.power > 0) {
            // camera.zoom = 1 - this.power / 1.5;
        }
        if (this.direction.length == 0) {
            this.direction.x = 0;
            this.direction.y = 1;
            this.direction.z = 0;
        }

        let idealOffset = new THREE.Vector3(0, 8, -16);
        // let idealOffset = new THREE.Vector3(3, 0, 0);
        // console.log(Character.rotation);
        idealOffset.applyQuaternion(Character.quaternion);
        idealOffset.add(Character.position);
        let idealLookat = new THREE.Vector3(0, 10, 50);
        idealLookat.applyQuaternion(Character.quaternion);
        idealLookat.add(Character.position);

        const t = 0.1;
        // const t = 1;
        // const t = 4.0 * timeElapsed;
        // const t = 1.0 - Math.pow(0.001, timeElapsed);

        this.cameraPosition.lerp(idealOffset, t);
        this.cameraLookAt.lerp(idealLookat, t);

        camera.position.copy(this.cameraPosition);
        // camera.rotation.set(Character.rotation.x, Character.rotation.y, Character.rotation.z);
        camera.lookAt(this.cameraLookAt);
        // console.log(idealOffset, idealLookat)

        let up = new THREE.Vector3(0,1,0);
        up.applyQuaternion(Character.quaternion);
        up.lerp(camera.up, 0.95)
        camera.up.set(up.x, up.y, up.z);

        camera.updateProjectionMatrix();
    }
    
    updatePosition() {
        this.direction = new THREE.Vector3(0, 0, this.power * 3);
        this.direction.applyQuaternion(Character.quaternion);
        // direction.add(Character.position);
        
        Character.position.add(this.direction);
        
        if (this.controls.w) {
            Character.rotateOnAxis(new THREE.Vector3(1,0,0), 0.05);
        }
        if (this.controls.s) {
            Character.rotateOnAxis(new THREE.Vector3(1,0,0), -0.05)
        }
        
        if (this.controls.a) {
            // let dir = new THREE.Vector3(direction.x, direction.y, direction.z);
            // Character.rotateOnAxis(dir.normalize(), 0.2);
            Character.rotateOnAxis(new THREE.Vector3(0,0,1), -0.05);
        }
        if (this.controls.d) {
            // let dir = new THREE.Vector3(direction.x, direction.y, direction.z);
            // Character.rotateOnAxis(dir.normalize(), -0.2);
            Character.rotateOnAxis(new THREE.Vector3(0,0,1), 0.05);
        }

        if (this.controls.up) {
            this.power += 0.01;
            this.engine1.layers.enable(BLOOM_SCENE);
            this.engine2.layers.enable(BLOOM_SCENE);
            // if (this.power >= 1) {
            //     this.power = 1;
            // }
        }
        if (this.controls.down) {
            this.power *= 0.95;
            if (this.power > -0.05 && this.power < 0.05) {
                this.engine1.layers.disable(BLOOM_SCENE)
                this.engine2.layers.disable(BLOOM_SCENE)
                this.power = Math.round(this.power);
            }
        }
        if (this.controls.left) {
            Character.rotateOnAxis(new THREE.Vector3(0,1,0), 0.01);
        }
        if (this.controls.right) {
            Character.rotateOnAxis(new THREE.Vector3(0,1,0), -0.01);
        }
    }

    updateLights() {

        // this.hightlight.position.set(3, 5, -2.5);
        // this.hightlight.position.applyQuaternion(Character.quaternion);
        // this.hightlight.position.add(Character.position);


        let enginePosition1 = new THREE.Vector3(1.15, 0.16, -2.8);
        enginePosition1.applyQuaternion(Character.quaternion);
        enginePosition1.add(Character.position);

        this.engine1.position.set(enginePosition1.x, enginePosition1.y, enginePosition1.z);
        this.engine1.emmitter.update();

        // this.engine1Light.position.set(enginePosition1.x, enginePosition1.y, enginePosition1.z);

        let enginePosition2 = new THREE.Vector3(-1.15, 0.16, -2.8);
        // // let enginePosition2 = new THREE.Vector3(-1.15, 0.16, -4);
        enginePosition2.applyQuaternion(Character.quaternion);
        enginePosition2.add(Character.position);

        this.engine2.position.set(enginePosition2.x, enginePosition2.y, enginePosition2.z);
        this.engine2.emmitter.update();
        // this.engine2Light.position.set(enginePosition2.x, enginePosition2.y, enginePosition2.z);

    }
    
    shoot() {
        this.cooldown = 3;
        let barrelPosition1 = new THREE.Vector3(3.5, -1, 1);
        barrelPosition1.applyQuaternion(Character.quaternion);
        barrelPosition1.add(Character.position);
        
        let barrelPosition2 = new THREE.Vector3(-3.5, -1, 1);
        barrelPosition2.applyQuaternion(Character.quaternion);
        barrelPosition2.add(Character.position);

        if (this.direction.length() != 0) {
            projectiles.push(makeShot(barrelPosition1, new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z)));
            projectiles.push(makeShot(barrelPosition2, new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z)));
        }
    }
}

class ParticleEmmiter {
    constructor(parent) {
        this.parent = parent;

        this.particles = [];
        this.maxParticles = 25;
        this.randomThreshhold = 0.2;
    }

    update() {
        if (characterController.power != 0 && Math.random() > this.randomThreshhold && this.particles.length < this.maxParticles) {
            this.particles.push(new Particle(new THREE.Vector3(this.parent.position.x + (Math.random()-0.5), this.parent.position.y + (Math.random()-0.5), this.parent.position.z + (Math.random()-0.5)), new THREE.Vector3(-characterController.direction.x, -characterController.direction.y, -characterController.direction.z).setLength(1)));
        }
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].update(this.parent.position) == true) {
                this.particles.splice(i,1);
            }
        }
    }
}
class Particle {
    constructor(pos, vel) {   
        this.life = 20;    
        this.mesh = makeCube(0x7070ff);
        this.mesh.position.set(pos.x, pos.y, pos.z);
        // this.mesh.velocity = vel;
        this.mesh.velocity = new THREE.Vector3(0,0,0);
    }
    update() {
        this.life--;
        this.mesh.position.set(this.mesh.position.x+this.mesh.velocity.x, this.mesh.position.y+this.mesh.velocity.y, this.mesh.position.z+this.mesh.velocity.z);
        if (this.life < 0) {
            scene.remove(this.mesh);
            return true;
        }
        return false;
    }
    
}
class Blackhole {
    constructor(pos) {
        this.mesh = makeSphere(50, pos, 0x102010);
        this.mesh.layers.enable(BLOOM_SCENE);
        this.blackMesh = makeSphere(49, new THREE.Vector3(102, 0, 0), 0x000000)
    }
    update() {
        let temp = new THREE.Vector3(Character.position.x, Character.position.y, Character.position.z);
        temp.sub(this.mesh.position);
        temp.setLength(2);
        this.blackMesh.position.set(this.mesh.position.x + temp.x, this.mesh.position.y + temp.y, this.mesh.position.z + temp.z);

        let dist = this.mesh.position.distanceTo(Character.position);
        dist = 10/dist;
        temp.setLength(- 20 * dist);
        Character.position.add(temp);

    }
}
let blackhole1 = new Blackhole(new THREE.Vector3(100, -1000, -200));
let blackhole2 = new Blackhole(new THREE.Vector3(100, 1000, 500));




animate();