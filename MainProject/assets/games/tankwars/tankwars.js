const TankWarsPlayer = require('./tankwarsplayer.js');
const TankWarsUpdate = require('./tankwarsupdate.js');
const TankWarsMap = require('./tankwarsmap.js');
const Vector2D = require("../../universals/vector2d");

class TankWars {
    constructor() {
        this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        this.type = this.constructor.name;
        this.state = "waiting";
        this.players = [];
        this.projectiles = [];

        this.minPlayers = 2;
        this.maxPlayers = 6;
        this.startCountdown = 200;

        this.nextUpdate = new TankWarsUpdate();

        this.map = new TankWarsMap();

        terminal.log("created new " + this.constructor.name + ", teamMode: " + this.teamMode);
    }
    
    removePlayer(id) {
        let index = this.players.findIndex(player => player.id === id);

        this.players.splice(index, 1);
    }

    addPlayer(player) {
        player.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1.0)`;
        this.players.push(player);
    }

    returnPlayer(id, isMobile) {
        return new TankWarsPlayer(id, this, isMobile);
    }

    loop() {
        if (this.state == "running") {
            this.run();
        } else if (this.state == "waiting") {
            this.run();
            this.startCountdown --;
            if (this.startCountdown <= 0 && this.players.length >= this.minPlayers) {
                this.state = "running";
                this.nextUpdate.specials.push({type: "gameStateChange"});
                this.projectiles = [];
                for (let i = 0; i < this.players.length; i++) {
                    this.players[i].teleportRandom();
                    this.players[i].weapon.currentAmmo = this.players[i].weapon.maxAmmo;
                }
            }

        }
        
    }
    
    ioUpdate() {
        for (let i = 0; i < this.players.length; i++) {
            if ((this.players[i].health <= 0 || this.players[i].clientInput.state == "dead") && this.players[i].state == "playing") {
                this.players[i].state = "dead";
                this.players[i].effects.freeze.bool = true;
                this.players[i].effects.freeze.countdown = 200;
                server.io.to(this.id).emit('playerIsDead', this.players[i].id);
            }
            this.nextUpdate.addPlayerUpdate(this.players[i].getUpdate());
        }
        for (let i = 0; i < this.projectiles.length; i++) {
            this.nextUpdate.addProjectileUpdate(this.projectiles[i].getUpdate());
        }

        server.io.to(this.id).emit('serverUpdate', this.nextUpdate);
        this.nextUpdate = new TankWarsUpdate();
    }

    run() {
        for (let i = 0; i < this.players.length; i++) {

            this.players[i].updateEffects();

            if (this.players[i].effects.freeze.bool == false) {
                this.players[i].move();
                this.players[i].collisionCheck();
                this.players[i].shootCheck();
                if (this.players[i].clientInput.collision) {
                    let index = this.projectiles.findIndex(projectile => projectile.id === this.players[i].clientInput.collision.id);
                    if (index != -1) {
                        this.players[i].hit(index);
                    }
                    delete this.players[i].clientInput.collision;
                }
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].life <= 0) {
                server.io.to(this.id).emit('deleteProjectile', this.projectiles[i].id);
                this.projectiles.splice(i, 1);
            }
        }
    }

    returnGame() {
        let _players = [];
        for (let i = 0; i < this.players.length; i++) {
            _players.push(this.players[i].returnSelf());
        }
        return {id: this.id, type: this.type, state: this.state, players: _players, map: this.map}
    }

    isOpen(data) {
        console.log(this.type, data.gameType, this.state);
        if (this.type === data.gameType && ((this.state === "waiting" && this.players.length < this.maxPlayers) || (this.state === "running" && this.players.length < this.maxPlayers))) {
            return true;
        }
        return false;
    }
}

module.exports = TankWars;