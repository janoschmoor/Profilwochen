const TimeManager = require('./timemanager');
const Game = require('../games/super/game.js')
const TankWars = require('../games/tankwars/tankwars.js');
const Platformer = require('../games/platformer/platformer.js');

console.log(process.argv[2]);

class Server {
    constructor() {
        // IO
        if (process.argv[2] == "local") {
            this.ip = '192.168.129.168';
            this.port = 3000;
        } else {
            this.port = process.env.PORT || 80;
        }

        this.express = require('express');
        this.path = require('path');
        
        this.app = this.express();

        // this.app.get('/tankwars.html', function (req, res, next) {
        //     console.log(req.query.name);
        //     // res.send("<p id=\"yourname\">"+req.query.name+"</p>")
        //     next();
        // });
        // this.app.get('/platformer.html', function (req, res, next) {
        //     console.log(req.query.name);
        //     // res.send("<p id=\"yourname\">"+req.query.name+"</p>");
        //     next();
        // });

        this.app.use(this.express.static('public'));
        this.app.use('/build/', this.express.static(this.path.join(__dirname, '../../node_modules/three/build')));
        this.app.use('/jsm/', this.express.static(this.path.join(__dirname, '../../node_modules/three/examples/jsm')));
        this.app.use('/fonts/', this.express.static(this.path.join(__dirname, '../../node_modules/three/examples/fonts')));
        this.app.use('/home/', this.express.static(this.path.join(__dirname, '../../../public/home')));
        // this.app.use('/howler/', this.express.static(this.path.join(__dirname, '../../node_modules/howler')));
        
        
        this.server = this.app.listen(this.port, this.ip);
        
        this.io = require('socket.io')(this.server);

        this.buildAllListeningEvents();

        // non IO stuff
        this.timeManager = new TimeManager();
        this.physicsTimeStep = 0;

        this.clients = [];
        // this.availableGames = ["Game", "TankWars", "Platformer"];
        this.availableGames = ["TankWars", "Platformer"];
        this.games = [];

        this.storedNames = [];

    }

    mainPhysicsLoop() {
        for (let i = 0; i < this.games.length; i++) {
            this.games[i].loop();
            if (this.games[i].delete) {
                terminal.log("deleted game: " + this.games[i].id + " of type: " + this.games[i].type);
                this.games.splice(i, 1);
            }
        }
    }

    mainIO() {
        for (let i = 0; i < this.games.length; i++) {
            this.games[i].ioUpdate();
        }
    }

    makeNewGame(gameType, players) {
        if (this.availableGames.includes(gameType)) {
            this.games.push(eval("new " + gameType + "()"));
        }
    }

    buildAllListeningEvents() {
        this.io.sockets.on('connection',
            function (socket) {
                socket.on('establishConnection',
                    function(data) {
                        let index = server.games.findIndex(game => game.isOpen(data) === true);
                        let name = data.name;
                        
                        if (index != -1) {
                            server.clients.push(server.games[index].returnPlayer(socket.id, data.isMobile));
                            server.games[index].addPlayer(server.clients[server.clients.length - 1], socket.handshake.address, name);
                            socket.join(server.games[index].id);
                            let gameAndId = {
                                game: server.games[index].returnGame(),
                                id: socket.id
                            }
                            server.io.to(`${socket.id}`).emit('game', gameAndId);
                            socket.to(server.games[index].id).emit('newPlayer', server.clients[server.clients.length - 1].returnSelf())
                        } else if (server.availableGames.includes(data.gameType)) {
                            server.games.push(eval("new " + data.gameType + "()"));
                            server.clients.push(server.games[server.games.length - 1].returnPlayer(socket.id, data.isMobile));
                            server.games[server.games.length - 1].addPlayer(server.clients[server.clients.length - 1], socket.handshake.address, name);
                            socket.join(server.games[server.games.length - 1].id);
                            let gameAndId = {
                                game: server.games[server.games.length - 1].returnGame(),
                                id: socket.id
                            }
                            server.io.to(`${socket.id}`).emit('game', gameAndId);
                        } else {
                            server.io.to(`${socket.id}`).emit('error', "Invalid GameType");
                        }
                    });

                socket.on('disconnect',
                    function() {
                        let index = server.clients.findIndex(client => client.id === socket.id);
                        if (index != -1) {
                            terminal.log(socket.id + " disconnected");
                            let gameIndex = server.games.findIndex(game => game.id === server.clients[index].game.id);
                            if (gameIndex != -1) {
                                server.clients.splice(index, 1);
                                server.games[gameIndex].removePlayer(socket.id, socket.handshake.address);
                                socket.to(server.games[gameIndex].id).emit('removePlayer', socket.id);

                                if (server.games[gameIndex].players.length == 0) {
                                    terminal.log("deleted game: " + server.games[gameIndex].id + " of type: " + server.games[gameIndex].type);
                                    server.games.splice(gameIndex, 1);
                                }
                            }
                        }
                    });

                socket.on('clientUpdate',
                    function(data) {
                        let index = server.clients.findIndex(client => client.id === socket.id);
                        if (index != -1) {
                            server.clients[index].clientInput = data;
                        }
                    });
                
                socket.on('storeName',
                    function(data) {
                        // console.log(data);
                        // server.storedNames.push({ip: socket.handshake.address, name: data.name});
                        // terminal.log(server.storedNames[server.storedNames.length-1])
                        // if (server.storedNames.length > 50) {
                            // server.storedNames.splice(0,1);
                        // }
                    })
            }
        );
    }
}

module.exports = Server;
