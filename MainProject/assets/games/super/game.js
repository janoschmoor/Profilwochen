const Player = require('./player.js');
const GameUpdate = require('./gameupdate.js');
const Map = require('./map.js');
// const SynchronizedList = require('../../universals/synchronizedlist.js')

class Game {
    constructor() {
        this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        this.type = this.constructor.name;
        this.state = "waiting";
        this.players = [];
        // this.players.initSync(this.id);
        // console.log(this.players);

        this.map = new Map();

        terminal.log("created new " + this.constructor.name);
    }
    
    removePlayer(id) {
        let index = this.players.findIndex(player => player.id === id);
        this.players.splice(index, 1);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    returnPlayer(id, isMobile) {
        return new Player(id, this, isMobile);
    }

    loop() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].move();
        }
    }
    
    ioUpdate() {
        let update = new GameUpdate();
        for (let i = 0; i < this.players.length; i++) {
            update.addPlayerUpdate(this.players[i].getUpdate());
        }
        server.io.to(this.id).emit('serverUpdate', update);
    }

    returnGame() {
        let _players = [];
        for (let i = 0; i < this.players.length; i++) {
            _players.push(this.players[i].returnSelf());
        }
        return {id: this.id, type: this.type, state: this.state, players: _players, map: this.map}
    }
}

module.exports = Game;