//variable declaration section
let physicsWorld, scene, camera, renderer, rigidBodies = []

//Ammojs Initialization
Ammo().then(start)

function start (){

    tmpTrans = new Ammo.btTransform();

    setupPhysicsWorld();

    setupGraphics();
    createBlock();
    createBall(20);
    createBrick();
    // createBall(20);
    // createBall(30);
    // createBall(20);
    // createBall(30);

    renderFrame();

}







