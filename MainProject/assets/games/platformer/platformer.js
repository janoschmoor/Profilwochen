const PlatformerPlayer = require('./platformerplayer.js');
const PlatformerUpdate = require('./platformerupdate.js');
const Vector2D = require("../../universals/vector2d");
const PhysicsWorld = require("../../universals/physics2/physicsengine/physicsworld");
const PlayerCollider = require("../../universals/physics2/physicsengine/playercollider");
// const Terminal = require("../../universals/terminal")

class Platformer {
    constructor() {
        this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        this.type = this.constructor.name;
        this.state = "waiting";
        this.players = [];

        this.minPlayers = 2;
        this.maxPlayers = 10;
        this.startCountdown = 200;

        this.nextUpdate = new PlatformerUpdate();

        this.maps = require('./maps.json');
        this.items = require('./items.json').items;

        this.mapIndex = Math.floor(Math.random() * this.maps.maps.length);
        this.physicsWorld = new PhysicsWorld(this.maps.maps[this.mapIndex], this);
        

        // this.totalRounds = Math.floor(5 + Math.random()*10);
        this.totalRounds = 2
        this.round = this.totalRounds;
        this.timer = Date.now()+60000;

        this.lastDisconnectedIp = null;

        terminal.log("created new " + this.constructor.name);
    }
    
    removePlayer(id, ip) {
        this.lastDisconnectedIp = ip;
        let index = this.players.findIndex(player => player.id === id);
        this.players.splice(index, 1);

        this.physicsWorld.remove(id);
    }

    addPlayer(player, ip) {
        this.players.push(player);
        
        let temp = new PlayerCollider(this.physicsWorld, player.id, "0x222222",new Vector2D(this.maps.maps[this.mapIndex].startChunk.x * this.maps.maps[this.mapIndex].chunkSize, this.maps.maps[this.mapIndex].startChunk.y * this.maps.maps[this.mapIndex].chunkSize), 0, player);
        
        this.physicsWorld.add(temp);
        this.players[this.players.length - 1].collider = this.physicsWorld.colliders[this.physicsWorld.colliders.length - 1];

        if (this.state == "playing" || this.state == "waiting") {
            this.players[this.players.length-1].state = "playing";
        } else if (this.state == "building") {
            this.players[this.players.length-1].state = "building";
            if (!(ip == this.lastDisconnectedIp)) {
                this.players[this.players.length-1].takeItem();
            } else {
                this.players[this.players.length-1].item = false;
            }
        }
    }

    returnPlayer(id, isMobile) {
        return new PlatformerPlayer(id, this, isMobile);
    }

    loop() {
        if (this.state == "waiting") {
            this.physicsWorld.run();
            this.run();

            if (this.players.length > 0) {
                this.changeGameState();
            }

        } else if (this.state == "playing") {
            this.physicsWorld.run();
            this.run();

        } else if (this.state == "building") {
            // this.physicsWorld.run();
            this.run();
        }
        if (this.timer < Date.now()) {
            this.changeGameState();
        }
        
    }
    
    ioUpdate() {
        for (let i = 0; i < this.players.length; i++) {
            this.nextUpdate.addPlayerUpdate(this.players[i].getUpdate());
        }
        for (let i = 0; i < this.physicsWorld.colliders.length; i++) {
            this.nextUpdate.addColliderUpdate(this.physicsWorld.colliders[i].getUpdate());
        }

        server.io.to(this.id).emit('serverUpdate', this.nextUpdate);
        this.nextUpdate = new PlatformerUpdate();
    }

    run() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.state == "playing") {
                this.players[i].move();
                this.players[i].check();
            } else if (this.state == "building") {
                this.players[i].godMove();
                this.players[i].godCheck();
                if (this.players[i].item) {
                    this.players[i].item.pos.set(Math.round(this.players[i].collider.pos.x + 1), Math.round(this.players[i].collider.pos.y));
                }
            }
        }
    }

    returnGame() {
        let _players = [];
        for (let i = 0; i < this.players.length; i++) {
            _players.push(this.players[i].returnSelf());
        }
        return {id: this.id, type: this.type, state: this.state, players: _players, physicsWorld: this.physicsWorld.returnSelf(), timer: this.timer, totalRounds: this.totalRounds, round: this.round}
    }

    changeGameState() {
        if (this.round == 0) {
            this.finish();
        }
        if (this.state == "waiting") {
            this.timer = Date.now() + 60000;
            this.state = "playing";
            this.nextUpdate.specials.push({type: "changeGameState", state: this.state, endTime: this.timer});

            for (let i = 0; i < this.players.length; i++) {
                this.players[i].tpToStart();
            }
        } else if (this.state == "playing") {
            this.timer = Date.now() + 20000;
            this.state = "building";
            this.nextUpdate.specials.push({type: "changeGameState", state: this.state, endTime: this.timer});

            let playerthingsupdate = {type: "playerScores", data: []};

            for (let i = 0; i < this.players.length; i++) {
                this.players[i].score += this.players[i].tempScore;
                this.players[i].tempScore = 0;
                this.players[i].lives = 1;
                this.players[i].state = "building";
                this.players[i].tpToStart();
                this.players[i].takeItem();
                playerthingsupdate.data.push({id: this.players[i].id, score: this.players[i].score})
            }
            this.nextUpdate.specials.push(playerthingsupdate);


        } else if (this.state == "building") {
            this.timer = Date.now() + 60000;
            this.state = "playing";
            this.round -= 1;
            this.physicsWorld.lastUpdate = Date.now();
            this.nextUpdate.specials.push({type: "changeGameState", state: this.state, endTime: this.timer, round: this.round});

            this.cleanSensors();

            for (let i = 0; i < this.players.length; i++) {
                this.players[i].tpToStart();
                this.players[i].lives = 1;
                this.players[i].state = "playing";
                this.players[i].clientInput = {w:false, a:false, s:false, d:false, enter: false};
            }
        }
    }

    finish() {
        let highest = 0;
        let highestHolder = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].score > highest) {
                highest = this.players[i].score;
                highestHolder = this.players[i].id;
            }
        }
        console.log(highestHolder + " won with score " + highest);
        server.io.to(this.id).emit("gameOver", {id: highestHolder, score: highest});
        this.delete = true;
    }

    isOpen(data) {
        if (this.type === data.gameType && this.players.length < this.maxPlayers) {
            return true;
        }
        return false;
    }

    checkAdvanceGameState() {
        if (this.state == "playing") {
            let counter = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].state == "finished" || this.players[i].state == "dead") {
                    counter += 1;
                }
            }
            if (counter == this.players.length) {
                this.changeGameState();
            }
        } else if (this.state == "building") {
            let counter = 0;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].item == false) {
                    counter++;
                }
            }
            if (counter == this.players.length) {
                this.changeGameState();
            }  
            terminal.log(counter);
        }
    }

    cleanSensors() {
        let sensors = this.physicsWorld.colliders.filter(collider => collider.type === "Sensor")
        for (let i = 0; i < sensors.length; i++) {
            for (let j = 0; j < this.physicsWorld.colliders.length; j++) {
                if (!(sensors[i] === this.physicsWorld.colliders[j])) {
                    sensors[i].performCollision(this.physicsWorld.colliders[j]);
                }                
            }
        }
        // this.physicsWorld.remove(id);
        // this.nextUpdate.specials.push({type:"removeCollider", identifier: id})
    }
}

module.exports = Platformer;