class Vector2D {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  Vector2D.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.mult = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.div = function(other) {
    this.x /= other.x;
    this.y /= other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.normalize = function() {
    let scale = Math.sqrt(this.x**2 + this.y**2);
    this.x = this.x / scale;
    this.y = this.y / scale;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.magnitude = function(factor = false) {
    if (factor == false) {return Math.sqrt(this.x**2 + this.y**2);}
    this.normalize();
    this.x *= factor;
    this.y *= factor;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.scalarProduct = function(other) {
    return ((this.x * other.x) + (this.y * other.y));
  }
  Vector2D.prototype.interiorAngle = function(other) {
    return Math.acos((this.scalarProduct(other)) / (this.magnitude() * other.magnitude()));
  }
  
  function vector2DFromAngle(a) {
    let angle = a % (2*Math.PI);
    if (angle < 0) {
      angle += 2*Math.PI;
    }
    if (angle >= 0 && angle < Math.PI/2) {
      this.x = Math.cos(angle);
      this.y = Math.sin(angle);
    } else if (angle >= Math.PI/2 && angle < Math.PI) {
      angle -= Math.PI/2;
      this.x = -Math.sin(angle);
      this.y = Math.cos(angle);
    } else if (angle >= Math.PI && angle < Math.PI*1.5) {
      angle -= Math.PI;
      this.x = -Math.cos(angle);
      this.y = -Math.sin(angle);
    } else if (angle >= Math.PI*1.5 && angle < Math.PI*2) {
      angle -= Math.PI*1.5;
      this.x = Math.sin(angle);
      this.y = -Math.cos(angle);
    }
    return new Vector2D(this.x, this.y);
  }



let ip = '192.168.129.178';
let port = 3000;

var express = require('express');
var app = express();
var server = app.listen(port, ip);
app.use(express.static('public'));
var io = require('socket.io')(server);





io.sockets.on('connection',

  function(socket) {

    socket.on('connectToGame',
        function() {
        
            game.players.push(new Player(socket.id));
            socket.join("game");

            // sending game to the new client
            io.to(`${socket.id}`).emit('gameData', game);
            // sending to all clients in "game" room except sender
            socket.to("game").emit('newClient', game.players[game.players.length-1]);

        }
    );

    socket.on('clientUpdate',
        function(data) {
            
            // Assign client input to corresponding player
            let index = game.players.findIndex(player => player.id === socket.id);
            if (index >= 0) {
                game.players[index].clientInput = data;
            }

        }
    );

    socket.on('disconnect', function() {
            
            let index = game.players.findIndex(player => player.id === socket.id);
            if (index >= 0) {
                // remove from server players list
                game.players.splice(index, 1);
                // sending to all clients in "game" room except sender
                socket.to("game").emit('deleteClient', socket.id);
            }


        }
    );
  }
);
console.log("listening @ : "+ip+":"+port);


class Projectile {
    constructor(pos, direction, speed) {
        this.pos = pos;
        this.direction = direction;
        this.speed = speed;
    }
    main() {

    }
    move() {
        let vel = new Vector2D(this.direction.x, this.direction.y);
        vel.magnitude(this.speed);
        vel.mult(new Vector2D(game.physicsTimeStep/1000, game.physicsTimeStep/1000));
        this.pos.add(vel);
	}
	
    // collision() {
    //     for (let i = 0; i < game.players.length; i++) {
    //         const player = game.players[i];
            
    //     }
    // }
	
    getUpdate() {
        return {pos: this.pos, direction: this.direction}
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.angle = 0;
        this.winkelgeschwindigkeit = 0;
        this.pos = new Vector2D(Math.random()*100+100,Math.random()*100+100);
        this.vel = new Vector2D(0,0);
        this.movementSpeed = 100;
        this.rotationalSpeed = 1.5 * Math.PI;
		this.shootCooldown = 60;
		this.m = 1;

        this.clientInput = {
            forward: false,
            left: false,
            right: false,
            backward: false,
            shoot: false,
            shift: false
        }
        
	}
	
    move() {
        this.vel = new Vector2D(0,0);

        let direction = vector2DFromAngle(this.angle);

		if (this.clientInput.shift) {
			this.m = 2;
		} else {
			this.m = 1;
		}

        if (this.clientInput.forward) {
            this.vel.add(direction.magnitude(this.movementSpeed * this.m));
        }
        if (this.clientInput.backward) {
            this.vel.add(direction.magnitude(-this.movementSpeed/2 * this.m));
        }

        this.vel.mult(new Vector2D(game.physicsTimeStep/1000, game.physicsTimeStep/1000));
        this.pos.add(this.vel);
    }

    handleClientRotation() {

        this.winkelgeschwindigkeit = 0;

        if (this.clientInput.left) {
            this.winkelgeschwindigkeit -= this.rotationalSpeed;
        }
        if (this.clientInput.right) {
            this.winkelgeschwindigkeit += this.rotationalSpeed;
        }
        this.angle += this.winkelgeschwindigkeit * game.physicsTimeStep/1000;
        
	}
	
    checkIfClientShoots() {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        if (this.clientInput.shoot && this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = 50;
        }
	}
	
    shoot() {
		game.projectiles.push(new Projectile(new Vector2D(this.pos.x, this.pos.y), vector2DFromAngle(this.angle), 110));
		io.emit('newProjectile', game.projectiles[game.projectiles.length - 1]);
	}
	
    getUpdate() {
        return {pos: this.pos, vel: this.vel, angle: this.angle, winkelgeschwindigkeit: this.winkelgeschwindigkeit}
	}
}

class Game {
    constructor() {
        this.players = [];
        this.projectiles = [];

        this.time = Date.now();

        this.preferedTickRate = 40;
        this.startTimeOfPreviousML = Date.now();
        this.physicsTimeStep = 0;
        
    }
    main() {
        this.physicsTimeStep = Date.now() - this.startTimeOfPreviousML;
        this.startTimeOfPreviousML = Date.now();
		
		var update = {
            playerUpdates: [],
            projectileUpdates: []
        };

        for (let i = 0; i < game.players.length; i++) {
			const player = game.players[i];
			
            player.handleClientRotation();
            player.move();
            player.checkIfClientShoots();
			update.playerUpdates.push(player.getUpdate());
		}
        
        if (game.projectiles.length > 20) {
			game.projectiles.splice(0, 1);
		}
		
        for (let i = 0; i < game.projectiles.length; i++) {
			const projectile = game.projectiles[i];
			
            projectile.move();
            // projectile.collision();
			update.projectileUpdates.push(projectile.getUpdate());
        }
		
        
		io.emit('serverUpdate', update);

		setTimeout(() => { game.main() }, 500);
    }
}

let game = new Game();
game.main();

