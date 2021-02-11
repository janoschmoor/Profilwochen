var socket;
var game;
var myId;
var thisPlayer;
var timeOfLastPhysicsEstimation = Date.now();

function connect() {
    // socket = io.connect('192.168.1.110:3000');
    socket = io.connect('192.168.129.170:3000');
    
    listen();
    socket.emit('connectToGame',{type: "Game", isOnMobile: isOnMobile});
}
function listen() {

    socket.on('connectedToGame',
        function(serverGame) {
            myId = socket.id;
            game = new Game(serverGame);
            thisPlayer = game.players[game.players.findIndex(player => player.id === myId)];
        }
    );
    socket.on('ioUpdate',
        function(update) {
            //          Add new players
            for (let i = 0; i < update.newPlayers.length; i++) {
                //  Prevent adding same player twice
                if (game.players.findIndex(player => player.id === update.newPlayers[i].id) == -1) {
                    game.players.push(new Player(update.newPlayers[i]));
                }
            }
            //          Remove players
            for (let i = 0; i < update.removePlayers.length; i++) {
                console.log(update.removePlayers[i]);
                let index = game.players.findIndex(player => player.id === update.removePlayers[i].id)
                if (index != -1) {
                    game.players.splice(index, 1);
                }
            }

            //          Update existing players
            for (let i = 0; i < update.players.length; i++) {
                let index = game.players.findIndex(player => player.id === update.players[i].id);
                if (index != -1) {
                    game.players[index].authUpdate(update.players[i])
                }
            }
            timeOfLastPhysicsEstimation = Date.now();
        }
    );
    
}
