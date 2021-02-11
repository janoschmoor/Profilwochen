var socket;
var game;
var myId;
var thisPlayer;
var timeOfLastPhysicsEstimation = Date.now();
var timeStep;

function connect() {
    socket = io.connect('192.168.129.170:3000');
    // socket = io.connect('192.168.128.216:3000');
    
    listen();
    socket.emit('connectToGame',{type: "TankWars", isOnMobile: isOnMobile});
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
            //          Add new Projectile
            for (let i = 0; i < update.newProjectiles.length; i++) {
                if (update.newProjectiles[i].type == "TankWarsProjectile") {
                    game.projectiles.push(new Projectile(update.newProjectiles[i]));
                }
            }

            //          Update existing players
            for (let i = 0; i < update.players.length; i++) {
                let index = game.players.findIndex(player => player.id === update.players[i].id);
                if (index != -1) {
                    game.players[index].authUpdate(update.players[i]);
                }
            }
            //          Update existing projectiles
            for (let i = 0; i < update.projectiles.length; i++) {
                let index = game.projectiles.findIndex(projectile => projectile.id === update.projectiles[i].id);
                if (index != -1) {
                    game.projectiles[index].authUpdate(update.projectiles[i]);
                }
            }
            timeOfLastPhysicsEstimation = Date.now();
        }
    );
    
}
