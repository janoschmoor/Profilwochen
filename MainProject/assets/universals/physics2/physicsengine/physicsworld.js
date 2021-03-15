const Vector2D = require("../lib/vector2d");
const Chunk = require("./chunk");
const Collider = require("./collider");

const Rectangle = require("./collisionshapes/rectangle");
const Entity = require("./entity");
const Sensor = require("./sensor");

class PhysicsWorld {
    constructor(worldData, game) {
        this.game = game;
        this.timestep = 0;
        this.lastUpdate = Date.now();

        this.chunkSize = worldData.chunkSize;
        this.physicalRenderDistance = 3;
        this.gravity = new Vector2D(worldData.gravity.x, worldData.gravity.y);

        this.chunks = [];
        this.worldSize = new Vector2D(worldData.worldSize.x, worldData.worldSize.y);
        this.initChunks();

        this.updatables = [];

        this.nextColliderId = 0;

        this.colliders = [];

        this.dynamicColliders = [];
        this.staticColliders = [];

        this.activeColliders = [];

        this.startChunk = worldData.startChunk;
        this.endChunk = worldData.endChunk;

        this.initColliders(worldData.colliders);
    }

    returnSelf() {
        let _colliders = [];
        for (let i = 0; i < this.colliders.length; i++) {
            _colliders.push(this.colliders[i].returnSelf());
        }
        return {
            timestep: this.timestep,
            lastUpdate: this.lastUpdate,
            chunkSize: this.chunkSize,
            physicalRenderDistance: this.physicalRenderDistance,
            gravity: this.gravity,
            chunks: this.chunks,
            worldSize: this.worldSize,
            colliders: _colliders
        }
    }
    
    run() {
        this.timestep = (Date.now() - this.lastUpdate) / 1000;
        this.lastUpdate = Date.now();

        for (let i = 0; i < this.staticColliders.length; i++) {
            if (this.staticColliders[i].angularVel) {
                this.staticColliders[i].rotate(this.staticColliders[i].angularVel);
            } 
        }

        for (let i = this.dynamicColliders.length-1; i >= 0; i--) {

            this.dynamicColliders[i].updateMotionState();
            this.dynamicColliders[i].resetTouchingVertices();

            for (let j = 0; j < this.staticColliders.length; j++) {
                this.dynamicColliders[i].performCollision(this.staticColliders[j]);
            }
            for (let j = 0; j < this.dynamicColliders.length; j++) {
                if (j != i) {
                    this.dynamicColliders[i].performCollision(this.dynamicColliders[j]);
                }
            }
            this.dynamicColliders[i].customRun();
        }

        for (let i = 0; i < this.updatables.length; i++) {
            this.updatables[i].update();
        }
    }

    add(collider) {
        this.colliders.push(collider);
        if (collider.mass) {
            this.dynamicColliders.push(collider);
        } else {
            this.staticColliders.push(collider);
        }
        if (collider.isActive) {
            this.activeColliders.push(collider)
        }

        let chunkPos = collider.getOwnChunks();
        if (chunkPos.isInside(this.worldSize)) {
            this.chunks[chunkPos.x][chunkPos.y].colliders.push(collider.id);
        }

        // console.log(collider.getOwnChunks())
    }

    remove (id) {
        let index = this.colliders.findIndex(collider => collider.id === id);
        if (index != -1) {
            this.colliders.splice(index, 1);
        }

        index = this.dynamicColliders.findIndex(collider => collider.id === id);
        if (index != -1) {
            this.dynamicColliders.splice(index, 1);
        }

        index = this.staticColliders.findIndex(collider => collider.id === id);
        if (index != -1) {
            this.staticColliders.splice(index, 1);
        }
        
        index = this.activeColliders.findIndex(collider => collider.id === id);
        if (index != -1) {
            this.activeColliders.splice(index, 1);
        }
        
        index = this.colliders.findIndex(c => c.type == "PlayerCollider");
        if (index != -1) {
            let game = this.colliders[index].reference.game;
            game.nextUpdate.specials.push({type: "removeCollider", identifier: id});
        }
    }

    initChunks() {
        for (let x = 0; x < this.worldSize.x; x++) {
            this.chunks.push([]);
            for (let y = 0; y < this.worldSize.y; y++) {
                this.chunks[x][y] = new Chunk(x, y);
            }
        }
    }

    initColliders(colliders) {
        for (let i = 0; i < colliders.length; i++) {
            let collider;
            if (colliders[i].type == "stationary_rectangle") {
                collider = new Collider(this, this.nextColliderId, colliders[i].color, new Vector2D(colliders[i].pos.x, colliders[i].pos.y), new Rectangle(colliders[i].size.width, colliders[i].size.height), colliders[i].angle);
                this.nextColliderId++;
            } else if (colliders[i].type == "entity_rectangle") {
                collider = new Entity(this, this.nextColliderId, colliders[i].color, new Vector2D(colliders[i].pos.x, colliders[i].pos.y), new Rectangle(colliders[i].size.width, colliders[i].size.height), colliders[i].angle, new Vector2D(colliders[i].vel.x, colliders[i].vel.y), colliders[i].angularVel);
                this.nextColliderId++;
            }
            this.add(collider);
            
        }

        let sensor = new Sensor(this, this.nextColliderId, "0xff0054", new Vector2D(this.startChunk.x * this.chunkSize + this.chunkSize / 2, this.startChunk.y * this.chunkSize + this.chunkSize / 2), new Rectangle(this.chunkSize, this.chunkSize), "startChunk");
        this.nextColliderId++;
        this.add(sensor);
        let sensor2 = new Sensor(this, this.nextColliderId, "0xff0054", new Vector2D(this.endChunk.x * this.chunkSize + this.chunkSize / 2, this.endChunk.y * this.chunkSize + this.chunkSize / 2), new Rectangle(this.chunkSize, this.chunkSize), "endChunk");
        this.nextColliderId++;
        this.add(sensor2);

        let collider = new Collider(this, this.nextColliderId, "0xff0000", new Vector2D(this.startChunk.x * this.chunkSize + this.chunkSize / 2, (this.startChunk.y + 1 + (0.5 / this.chunkSize)) * this.chunkSize), new Rectangle(this.chunkSize + 2, 1));
        this.nextColliderId++;
        this.add(collider);
        let collider2 = new Collider(this, this.nextColliderId, "0xff0000", new Vector2D(this.endChunk.x * this.chunkSize + this.chunkSize / 2, (this.endChunk.y + 1 + (0.5 / this.chunkSize)) * this.chunkSize), new Rectangle(this.chunkSize + 2, 1));
        this.nextColliderId++;
        this.add(collider2);
    }
}

module.exports = PhysicsWorld;