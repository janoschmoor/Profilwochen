
var physicsWorld = new PhysicsWorld();
var me;



function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    

    let collider = new Collider(new Vector2D(0, 10), new Rectangle(20, 1), Math.PI/2);
    physicsWorld.add( collider );
    // collider = new Collider(new Vector2D(-30, -10), new Rectangle(20, 0.05), Math.PI/4*3);
    // physicsWorld.add( collider );
    // collider = new Collider(new Vector2D(30, -10), new Rectangle(20, 0.05), Math.PI/4);
    // physicsWorld.add( collider );


    
    let entity = new Entity(new Vector2D(0, -20), new Rectangle(3, 1), -Math.PI/4*3, new Vector2D(0, 0), 0);
    physicsWorld.add( entity );

    let player = new Player(new Vector2D(0, -10));
    physicsWorld.add( player );
    me = player;

}

function draw() {
    background(230);


    // if (keyIsDown(87)) {
        
    // }
    // if (keyIsDown(65)) {
    //     me.acc.x += -1;
    // }
    // // if (keyIsDown(83)) {
    // //     me.setTranslation(me.pos.x, me.pos.x-1);
    // // }
    // if (keyIsDown(68)) {
    //     me.acc.x += 1;
    // }
    // me.setTranslation(mouseX, mouseY);

    

    physicsWorld.run();  

}

function mousePressed(mouseX, mouseY) {
    me.rotate(Math.PI / 8);
}
function keyTyped() {
    if (key == "w") {
        me.applyCentralForce(new Vector2D(0,-1000))
    }
    if (key == "a") {
        me.applyCentralForce(new Vector2D(-1000, 0))
    }
    if (key == "d") {
        me.applyCentralForce(new Vector2D(1000, 0))
    }
}