class PhysicsWorld {
    constructor(physicsWorld) {
        this.timestep = physicsWorld.timestep;
        this.lastUpdate = physicsWorld.lastUpdate;

        this.chunkSize = physicsWorld.chunkSize;
        this.physicalRenderDistance = physicsWorld.physicalRenderDistance;
        this.gravity = new Vector2D(physicsWorld.gravity.x, physicsWorld.gravity.y);

        this.chunks = physicsWorld.chunks;
        this.worldSize = new Vector2D(physicsWorld.worldSize.x, physicsWorld.worldSize.y);

        this.colliders = [];

        this.dynamicColliders = [];

        this.staticColliders = [];

        this.activeColliders = [];

        this.collidersToDelete = [];
        
        for (let i = 0; i < physicsWorld.colliders.length; i++) {
            let collider = physicsWorld.colliders[i];
            if (physicsWorld.colliders[i].type == "Collider") {
                console.log("Collider");
                collider = new Collider(collider);
                this.add(collider);
            } else if (physicsWorld.colliders[i].type == "Entity") {
                console.log("Entity");
                collider = new Entity(collider);
                this.add(collider);
            } else if (physicsWorld.colliders[i].type == "PlayerCollider") {
                console.log("PlayerCollider");
                collider = new PlayerCollider(collider);
                this.add(collider);
            } else if (physicsWorld.colliders[i].type == "Sensor") {
                console.log("Sensor");
                collider = new Sensor(collider);
                this.add(collider);
            }
        }
    }
    
    run() {
        this.timestep = (Date.now() - this.lastUpdate) / 1000;
        this.lastUpdate = Date.now();


        for (let i = 0; i < this.dynamicColliders.length; i++) {

            this.dynamicColliders[i].updateMotionState();

            for (let j = 0; j < this.staticColliders.length; j++) {
                this.dynamicColliders[i].performCollision(this.staticColliders[j]);
            }
        }
    }

    add(collider) {
        this.colliders.push(collider);
        if (collider.mass) {
            this.dynamicColliders.push(collider);
        } else {
            this.staticColliders.push(collider);
        }
        if (this.isActive) {
            this.activeColliders.push(collider)
        }
    }

    initChunks() {
        for (let x = 0; x < this.worldSize.x; x++) {
            this.chunks.push([])
            for (let y = 0; y < this.worldSize.y; y++) {
                this.chunks[x] = new Chunk(x, y);
            }
        }
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
    }
}