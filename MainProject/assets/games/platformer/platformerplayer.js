const Vector2D = require("../../universals/vector2d");
const Client = require("../../server/client.js");
const Collider = require("../../universals/physics2/physicsengine/collider");
const Rectangle = require("../../universals/physics2/physicsengine/collisionshapes/rectangle");
const Wiretrap = require("../../universals/physics2/physicsengine/wiretrap");
const Entity = require("../../universals/physics2/physicsengine/entity");
const Portal = require("../../universals/physics2/physicsengine/portal");
const Turret = require("../../universals/physics2/physicsengine/turret");
const ForceField = require("../../universals/physics2/physicsengine/forcefield");


class PlatformerPlayer extends Client {
    constructor(id, game, isMobile) {
        super(id, game, isMobile);

        // this.pos = new Vector2D(0, 0);
        // this.size = new Vector2D(1, 1);

        this.state = "playing";
        this.lives = 1;

        this.collider;
        this.item;

        this.score = 0;
        this.tempScore = 0;

        this.clientInput = {w:false, a:false, s:false, d:false, enter: false}

        this.jumps = 1;

        terminal.log(id + " connected");
    }

    move() {
        if (this.state == "playing") {
            if (this.clientInput.a) {
                this.collider.vel.x -= 1;
            }
            if (this.clientInput.d) {
                this.collider.vel.x += 1;
            }
            if (this.clientInput.w) {
                this.jump();
            }
            if (this.clientInput.s) {
                this.collider.vel.add(new Vector2D(0, 1));
            }
        }
    }

    godMove() {
        if (this.clientInput.a) {
            this.collider.pos.x -= 0.5;
        }
        if (this.clientInput.d) {
            this.collider.pos.x += 0.5;
        }
        if (this.clientInput.w) {
            this.collider.pos.y -= 0.5;
        }
        if (this.clientInput.s) {
            this.collider.pos.y += 0.5;
        }
        if (this.clientInput.enter) {
            this.clientInput.enter = false;
            this.placeItem();
        }
    }

    jump() {
        if (this.collider.touchingVertices[0] && this.collider.touchingVertices[3] && (!this.collider.touchingVertices[1] && !this.collider.touchingVertices[2])) {
            this.collider.vel.add(new Vector2D(40, -35));
            this.clientInput.w = false;
        } else if (this.collider.touchingVertices[1] && this.collider.touchingVertices[2] && (!this.collider.touchingVertices[0] && !this.collider.touchingVertices[3])) {
            this.collider.vel.add(new Vector2D(-40, -35));
            this.clientInput.w = false;
        } else if (this.collider.touchingVertices[2] || this.collider.touchingVertices[3] && (!this.collider.touchingVertices[0] && !this.collider.touchingVertices[1])) {
            this.collider.vel.add(new Vector2D(0, -40));
            this.clientInput.w = false;
        }
    }
    
    check() {
        let chunks = this.collider.getOwnChunks();
        if (chunks.y > this.game.physicsWorld.worldSize.y+4 ||
            chunks.y < -4 ||
            chunks.x > this.game.physicsWorld.worldSize.x+4 ||
            chunks.x < -4) {
            if (this.lives > 1) {
                this.tpToStart();
                this.lives -= 1;
            } else {
                this.die();
                this.tpToStart();
            }
        }
        if (this.collider.touchingVertices[0] == true && this.collider.touchingVertices[1] == true && this.collider.touchingVertices[2] == true && this.collider.touchingVertices[3] == true) {
            this.die();
        }
    }

    godCheck() {
        // let chunks = this.collider.getOwnChunks();
        // if (chunks.y > this.game.physicsWorld.worldSize.y + 4) {
        //     this.collider.pos.y = (this.game.physicsWorld.worldSize.y + 4) * 4;
        // }
            
        // if (chunks.y < -4) {
        //     this.collider.pos.y = -4 * 4;
        // }

        // if (chunks.x > this.game.physicsWorld.worldSize.x + 4) {
        //     this.collider.pos.x = (this.game.physicsWorld.worldSize.x + 4) * 4;
        // }

        // if (chunks.x < -4) {
        //     this.game.physicsWorld.worldSize.x = -4 * 4;
        // }
    }

    getUpdate() {
        return {
			id: this.id,
            pos: this.pos
        }
    }

    returnSelf() {
        return {id: this.id, name: this.name, pos: this.pos, state: this.state, collider: this.collider.returnSelf()};
    }

    tpToStart() {
        this.collider.pos.set((this.game.physicsWorld.startChunk.x + 0.25 + Math.random()*0.5) * this.game.physicsWorld.chunkSize, (this.game.physicsWorld.startChunk.y + 0.25 + Math.random()*0.5) * this.game.physicsWorld.chunkSize)
    }
    tp(pos) {
        this.collider.pos.set(pos.x, pos.y);
    }
    tpToChunk(chunkPos) {
        this.collider.pos.set((chunkPos.x + 0.25 + Math.random()*0.5) * this.game.physicsWorld.chunkSize, (chunkPos.y + 0.25 + Math.random()*0.5) * this.game.physicsWorld.chunkSize)
    }

    takeItem() {
        let index = Math.floor(Math.random() * this.game.items.length);
        let item = this.game.items[index];
        let collider;
        if (item.type == "stationary_rectangle") {
            collider = new Collider(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width, item.size.height), item.angle);
            this.game.physicsWorld.nextColliderId ++;
        } else if (item.type == "wiretrap") {
            collider = new Wiretrap(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width, item.size.height), item.angle);
            this.game.physicsWorld.nextColliderId ++;
        } else if (item.type == "rotating_rectangle") {
            collider = new Collider(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width, item.size.height), item.angle);
            collider.angularVel = item.angularVel;
            this.game.physicsWorld.nextColliderId ++;
        } else if (item.type == "portal") {
            collider = new Portal(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width, item.size.height), item.angle);
            this.game.physicsWorld.updatables.push(collider);
            this.game.physicsWorld.nextColliderId ++;
        } else if (item.type == "turret") {
            collider = new Turret(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width, item.size.height), this.id, item.angle);
            this.game.physicsWorld.updatables.push(collider);
            this.game.physicsWorld.nextColliderId ++;
        } else if (item.type == "forcefield") {
            collider = new ForceField(this.game.physicsWorld, this.game.physicsWorld.nextColliderId, this.collider.color, new Vector2D(this.collider.pos.x + item.relativePos.x, this.collider.pos.y + item.relativePos.y), new Rectangle(item.size.width * (Math.random() * 5) , item.size.height * (Math.random() * 5)));
            this.game.physicsWorld.nextColliderId ++;
        }
        this.game.physicsWorld.add(collider);
        this.item = collider;
        this.game.nextUpdate.specials.push({type: "newCollider", data: collider.returnSelf()});
    }

    placeItem() {
        this.item = false;
        this.game.checkAdvanceGameState();
    }

    die() {
        this.state = "dead";
        this.game.nextUpdate.specials.push({type: "playerDied", id: this.id});
        this.game.checkAdvanceGameState();
    }
}

module.exports = PlatformerPlayer;