
//---------------------------------------------------------------//
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                   General IO Server Engine                    //
//                                                               //
//---------------------------------------------------------------//




// var things = require("someThings");

let ip = '192.168.129.170';
// let ip = '192.168.128.216';
let port = 3000;

//      Listen for Clients on specific IP and Port (defined at top)
var express = require('express');
var app = express();
var server = app.listen(port, ip);
app.use(express.static('public'));
var io = require('socket.io')(server);


//      CLASS: Vector2D
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

//      CLASS: Color
class Color {
  constructor(r, g, b, a = 255) {
    if (r == "random") {
      this.r = Math.random()*255;
      this.g = Math.random()*255;
      this.b = Math.random()*255;
      this.alpha = a;
    } else {
      this.r = r;
      this.g = g;
      this.b = b;
      this.alpha = a;
    }
  }
}


//      SUPER CLASS: IoUpdate
class IoUpdate {
  constructor() {
    this.players = [];
    this.newPlayers = [];
    this.removePlayers = [];
  }
}
//      CLASS: Terminal
class Terminal {
  constructor() {}
  log(data) {
    console.log("[Server @" + gameServer.statistic.cycles + "]: " + data);

  }
  warn(data) {
    console.log("[Warning @" + gameServer.statistic.cycles + "]: " + data);
  }
  critical(data) {
    console.log("[CRITICAL @" + gameServer.statistic.cycles + "]: " + data);
    gameServer.statistic.criticalCases++;
  }
  debug(data) {
    console.log("[Debug @" + gameServer.statistic.cycles + "]: " + data);
  }
  break() {
    console.log(" -- ")
  }
  // err(data) {
  //   console.error(data)
  // }
}
//      CLASS: Client
class Client {
  constructor(id, hasFunction, isOnMobile) {
    this.id = id;
    this.hasFunction = hasFunction;

    this.player;

    this.isOnMobile = isOnMobile;
  }
}
//      CLASS: Statistic
class Statistic {
  constructor() {
    this.liveMonitoringOperators = [];
    this.cycles = 0;
    this.criticalCases = 0;

    this.floatingMean60IntervallData = [];
    this.floatingMean60Intervall = 0;
    this.floatingMean60MlDeltaTimeData = [];
    this.floatingMean60MlDeltaTime = 0;

    this.onlinePlayers = 0;
    this.activeGames = 0;
  }
  nextTick() {
    this.cycles++;
  }
  newIntervallElement(intervall) {
    if (this.floatingMean60IntervallData.length >= 60) {
      this.floatingMean60IntervallData.splice(0, 1);
    }
    this.floatingMean60IntervallData.push(intervall);
    this.floatingMean60Intervall = this.floatingMean60IntervallData.reduce(function(a, b){return a + b;}, 0) / this.floatingMean60IntervallData.length;
    if (this.floatingMean60Intervall > 20) {
      terminal.warn("Floating Intervall Mean 60 has passed the threshold of 20 ms!! current value: "+  this.floatingMean60Intervall+ " ms")      
    }
  }
  newMlDeltaTimeElement(mlDeltaTime) {
    if (this.floatingMean60MlDeltaTimeData.length >= 60) {
      this.floatingMean60MlDeltaTimeData.splice(0, 1);
    }
    this.floatingMean60MlDeltaTimeData.push(mlDeltaTime);
    this.floatingMean60MlDeltaTime = this.floatingMean60MlDeltaTimeData.reduce(function(a, b){return a + b;}, 0) / this.floatingMean60MlDeltaTimeData.length;
    // if (this.floatingMean60MlDeltaTime > 20) {
    //   terminal.warn("Floating Mean 60 has passed the threshold of 20 ms!! current value: "+  this.floatingMean60MlDeltaTime+ " ms")      
    // }
  }
}
//      SUPER CLASS: Game
class Game {
  constructor(type) {
    this.maxAmountOfPlayers = 10;
    this.minAmountOfPlayers = 1;
    this.allowJoiningWithoutPartyCode = true;
    this.players = [];
    this.spectators = [];
    this.type = type;
    this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.partyCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);

    gameServer.statistic.activeGames++;

    this.world = {};

    this.ioUpdate = new IoUpdate();
  }
  addPlayer(id) {
    let index = gameServer.getClientIndexById(id);
    let isHost = false;
    if (this.players.length == 0) {isHost = true;}
    //      Here specific Games should make new specificPlayer
    this.players.push(new Player(this.id, isHost, id, gameServer.connectedClients[index].isOnMobile));
    gameServer.connectedClients[index].player = this.players[this.players.length-1];
  }
  addSpectator(id) {
    let index = gameServer.getClientIndexById(id);
    this.spectators.push(id);
    gameServer.connectedClients[index].player = {spectating: this.id};
  }
  removePlayer(id) {
    // let index = gameServer.getClientIndexById(id);
    // if (index == -1) {
    //   terminal.critical("Tried to remove player (" + ") which no longer exists!")
    // } else {
    //   gameServer.connectedClients[index].player = false;
    // }
    // let index2 = this.getPlayerIndexById(id);
    // if (index2 != -1) {
    //   this.ioUpdate.removePlayers.push(this.players[index2]);
    //   console.log(this.ioUpdate.removePlayers);
    //   this.players.splice(index2, 1);
    // } else {
    //   console.log("fail");
    // }
  }
  removeSpecator(id) {

  }
  getPlayerIndexById(id) {
    return this.players.findIndex(client => client.id === id);
  }
  completeListOfIoUdates() {
    for (let i = 0; i < this.players.length; i++) {
      this.ioUpdate.players.push(this.players[i].getIoUpdateData());
      
    }
  }
  doLogicAndPhysic() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].evaluateClientInput();
      this.players[i].calculatePhysics();
      
    }
  }
  resetIoUpdate() {
    this.ioUpdate = new IoUpdate();
  }

}
//      SUPER CLASS: Player
class Player {
  constructor(gameId, isHost, id, isOnMobile) {
    this.connectedToGame = true;
    this.playesGameType = "superClassGame";
    this.gameId = gameId;
    this.isHost = isHost;
    this.id = id;

    gameServer.statistic.onlinePlayers++;

    this.pos = new Vector2D(0, 0);
    this.vel = new Vector2D(0, 0);
    this.acc = new Vector2D(0, 0);
    this.frictionCoefficient = 0.5;
    this.shape = {r: 1};
    this.movementSpeed = 5;

    this.isOnMobile = isOnMobile;
    if (isOnMobile == true) {
      this.controlls = {joystick: new Vector2D(0,0)}
    } else {
      this.controlls = {w: false, a: false, s: false, d: false};
    }

    
  }
  evaluateClientInput() {
    this.vel = new Vector2D(0,0);
    if (this.isOnMobile == false) {
      if (this.controlls.w == true) {
        this.vel.y -= this.movementSpeed * gameServer.physicTimeStep;
      }
      if (this.controlls.s == true) {
        this.vel.y += this.movementSpeed * gameServer.physicTimeStep;
      }
      if (this.controlls.a == true) {
        this.vel.x -= this.movementSpeed * gameServer.physicTimeStep;
      }
      if (this.controlls.d == true) {
        this.vel.x += this.movementSpeed * gameServer.physicTimeStep;
      }
    } else {
      this.vel.x = this.controlls.joystick.x * this.movementSpeed * gameServer.physicTimeStep;
      this.vel.y = this.controlls.joystick.y * this.movementSpeed * gameServer.physicTimeStep;
    }
    
  }

  calculatePhysics() {
    this.pos.add(this.vel);
    // colisions
  }
  getIoUpdateData() {
    return {
      id: this.id,
      pos: this.pos,
      vel: this.vel
    }
  }
  handleClientInput(controlls) {
    if (this.isOnMobile) {
      this.controlls.joystick = new Vector2D(controlls.joystick.x, controlls.joystick.y);
    } else {
      this.controlls = controlls;
    }
  }
}



//      CLASS: GameServer
class GameServer {
  constructor() {
    this.startTime = Date.now();
    this.mlStartTime = 0;
    this.mlEndTime = Date.now();
    this.standardMlTimeOut = 16.66;
    this.standardIoTimeOut = 50;
    this.mlDeltaTime = this.standardMlTimeOut;
    this.mlTimer = 0;
    this.timeSinceLastIoUpdate = 0;
    this.timeOfLastIntervall = 0;
    this.physicTimeStep = 0;

    this.debug = false;
    
    this.statistic = new Statistic();

    this.connectedClients = [];

    this.waitingGames = [];
    this.runningGames = [];
    
  }


  main() {
    this.prepareForMain();


  //      Do WAITING GAMES logic (physics)
  for (let i = 0; i < this.waitingGames.length; i++) {
    this.waitingGames[i].doLogicAndPhysic();
  }
  
  
  //      Do RUNNING GAMES physics (logic)



    //      Trigger ioUpdate()
    this.timeSinceLastIoUpdate += this.timeOfLastIntervall;
    if (this.timeSinceLastIoUpdate > this.standardIoTimeOut) {
      this.timeSinceLastIoUpdate = this.timeSinceLastIoUpdate-this.standardIoTimeOut;
      this.ioUpdate();
    }

    this.afterMain()
  }

  //      Calculate actual interval time and update statistics
  prepareForMain() {
    this.mlStartTime = Date.now();
    this.timeOfLastIntervall = this.mlStartTime - this.mlEndTime + this.mlDeltaTime;
    this.physicTimeStep = this.timeOfLastIntervall / 1000;
    // if (this.timeOfLastIntervall > 1.5 * this.standardMlTimeOut) {
    //   let excess = Math.floor(100/this.standardMlTimeOut*this.timeOfLastIntervall-100);
    //   terminal.warn("Last intervall had a duration of "+ this.timeOfLastIntervall + " ms!! +" + excess + "% too much!! (timer was set to: " + this.mlTimer + " ms)")
    // }

    if (this.statistic) {
      this.statistic.nextTick();
      this.statistic.newIntervallElement(this.timeOfLastIntervall);
      this.statistic.newMlDeltaTimeElement(this.mlDeltaTime);
    }
  }
  //      Calculate time used by main() and set intervall accordingly
  afterMain() {
    this.mlEndTime = Date.now();
    this.mlDeltaTime = this.mlEndTime - this.mlStartTime;
    if (this.mlDeltaTime > this.standardMlTimeOut) {
      terminal.critical("ML used " + this.mlDeltaTime + " ms instead of " + this.standardMlTimeOut + " ms");
    }
    this.mlTimer = this.standardMlTimeOut - this.mlDeltaTime;
    if (this.mlTimer < 0) {this.mlTimer = 0;}
    setTimeout(() => { gameServer.main() }, this.mlTimer);
  }
  ioUpdate() {
    // for (let i = 0; i < this.statistic.liveMonitoringOperators.length; i++) {
    //   io.to(`${this.statistic.liveMonitoringOperators[i].id}`).emit('ServerStatusUpdateForMonitoring', {statistic: this.statistic});
    // }
    io.to('monitoringOpperators').emit('ServerStatusUpdateForMonitoring', {statistic: this.statistic});
    
    //      Waiting Games
    for (let i = 0; i < gameServer.waitingGames.length; i++) {
      gameServer.waitingGames[i].completeListOfIoUdates();
      io.to(gameServer.waitingGames[i].id).emit('ioUpdate', gameServer.waitingGames[i].ioUpdate);
      gameServer.waitingGames[i].resetIoUpdate();
    }
    //      Running Games
    for (let i = 0; i < gameServer.runningGames.length; i++) {
      gameServer.runningGames[i].completeListOfIoUdates();
      io.to(gameServer.runningGames[i].id).emit('ioUpdate', gameServer.runningGames[i].ioUpdate);
      gameServer.runningGames[i].resetIoUpdate();
    }  

  }
  getClientIndexById(id) {
    return this.connectedClients.findIndex(client => client.id === id);
  }
  getGameIndexAndStateByGameId(id) {
    let state = "waiting";
    let index = this.waitingGames.findIndex(game => game.id === id);
    if (index == -1) {
      index = this.runningGames.findIndex(game => game.id === id);
      state = "running";
    }
    return {index: index, state: state};
  }
  getGameIndexAndStateByPlayerId(id) {
    let clientIndex = this.getClientIndexById(id);
    let gameId = this.connectedClients[clientIndex].player.gameId;
    let state = "waiting";
    let index = this.waitingGames.findIndex(game => game.id === gameId);
    if (index == -1) {
      index = this.runningGames.findIndex(game => game.id === gameId);
      state = "running";
    }
    return {index: index, state: state};
  }
  getLiveMonitoringOpperatorIndexById(id) {
    return this.statistic.liveMonitoringOperators.findIndex(client => client.id === id);
  }
  newGame(type) {
    if (type == "Game") {
      gameServer.waitingGames.push(new Game(type));
    } else if (type == "TankWars") {
      gameServer.waitingGames.push(new TankWars(type));
    } else {
      terminal.critical("Fail")
    }
  }
  isRunning(id) {
    if (this.runningGames.findIndex(game => game.id === id) != -1) {
      return true;
    }
    return false;
  }
}
var terminal = new Terminal();
var gameServer = new GameServer();
terminal.log("Booting");



















//---------------------------------------------------------------//
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                            TankWars                           //
//                                                               //
//---------------------------------------------------------------//



class TankWarsIoUpdate extends IoUpdate {
  constructor() {
    super();
    this.newParticles = [];
    this.newItems = [];
    this.removeItems = [];
    this.projectiles = [];
    this.newProjectiles = [];
  }
}

class TankWars extends Game {
  constructor(type) {
    super(type);
    this.minAmountOfPlayers = 1;
    this.world = new TankWarsWorld();

    this.projectiles = [];
    this.ioUpdate = new TankWarsIoUpdate();

    this.totalProjectileCounter = 0;
  }
  addPlayer(id) {
    let index = gameServer.getClientIndexById(id);
    let isHost = false;
    if (this.players.length == 0) {isHost = true;}
    this.players.push(new Tank(this.id, isHost, id, gameServer.connectedClients[index].isOnMobile));
    gameServer.connectedClients[index].player = this.players[this.players.length-1];
  }

  doLogicAndPhysic() {
    // players
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].evaluateClientInput();
      this.players[i].calculatePhysics();
    }
    // projectiles
    for (let i = this.projectiles.length-1; i >= 0; i--) {
      this.projectiles[i].applyPhysics();
      if (this.projectiles[i].lifeIsOver == true) {
        // delete projectile
        this.projectiles.splice(i, 1);
        i--;
      }
      
    }
  }
  resetIoUpdate() {
    this.ioUpdate = new TankWarsIoUpdate();
  }
  completeListOfIoUdates() {
    for (let i = 0; i < this.players.length; i++) {
      this.ioUpdate.players.push(this.players[i].getIoUpdateData());
    }
    for (let i = 0; i < this.projectiles.length; i++) {
      this.ioUpdate.projectiles.push(this.projectiles[i].getIoUpdateData());
    }
  }
}

class Tank extends Player {
  constructor(gameId, isHost, id, isOnMobile) {
    super(gameId, isHost, id, isOnMobile);

    this.shape = {length: 0.75, width: 0.52, rotation: 0, rotationalVel: 0};
    this.movementSpeed = 2.3;
    this.rotationSpeed = 2*Math.PI / 1.5;

    this.color = new Color("random");
    this.weapon = new TankWarsWeapon(gameId, id);
    
    if (isOnMobile == true) {
      this.controlls = {joystick: new Vector2D(0,0), shoot: false}
    } else {
      this.controlls = {w: false, a: false, s: false, d: false, shoot: false};
    }
  }
  evaluateClientInput() {
    this.vel = new Vector2D(0,0);
    this.shape.rotationalVel = 0;
    if (this.isOnMobile == false) {
      if (this.controlls.a == true) {
        this.shape.rotationalVel -= this.rotationSpeed * gameServer.physicTimeStep;
      }
      if (this.controlls.d == true) {
        this.shape.rotationalVel += this.rotationSpeed * gameServer.physicTimeStep;
      }
      if (this.controlls.w == true) {
        this.vel.add(vector2DFromAngle(this.shape.rotation).magnitude(this.movementSpeed * gameServer.physicTimeStep))
        
      }
      if (this.controlls.s == true) {
        this.vel.add(vector2DFromAngle(this.shape.rotation).magnitude(this.movementSpeed * gameServer.physicTimeStep * -0.5))
      }
    } else {
      
      // if (this.controlls.joystick instanceof Vector2D) {
      //   console.log("hi")
      //   gameServer.thing = (this.joystick.interiorAngle(vector2DFromAngle(this.rotation)));

      // }

      this.vel.x = this.controlls.joystick.x * this.movementSpeed * gameServer.physicTimeStep;
      this.vel.y = this.controlls.joystick.y * this.movementSpeed * gameServer.physicTimeStep;
    }

    if (this.controlls.shoot == true) {
      this.controlls.shoot = false;
      this.weapon.shoot();
    }
    
  }
  calculatePhysics() {
    this.pos.add(this.vel);
    this.shape.rotation += this.shape.rotationalVel;
    // colisions
  }
  getIoUpdateData() {
    return {
      id: this.id,
      pos: this.pos,
      vel: this.vel,
      rotation: this.shape.rotation,
      rotationalVel: this.shape.rotationalVel
    }
  }
}

class TankWarsWorld {
  constructor() {
    let size = new Vector2D(parseInt(Math.random()*10+10), parseInt(Math.random()*10+10));
    this.size = size;

    this.cells = [];
    for (let x = 0; x < this.size.x; x++) {
      this.cells.push([]);
      for (let y = 0; y < this.size.y; y++) {
        this.cells[x].push(new TankWarsCell(x, y));
      } 
    }

  }
}
class TankWarsCell {
  constructor(x, y) {
    this.gridPos = new Vector2D(x, y);
    this.walls = {top: true, right: true, bottom: true, left: true};
  }
}
//      SUPER CLASS: TankWarsWeapon
class TankWarsWeapon {
  constructor(gameId, playerId) {
    this.gameId = gameId;
    this.playerId = playerId;

    this.munition = 4;
  }
  shoot() {
    this.munition --;
    let gameIndex = gameServer.waitingGames.findIndex(game => game.id === this.gameId);
    
    if (gameIndex != -1) {
      let playerIndex = gameServer.waitingGames[gameIndex].players.findIndex(player => player.id === this.playerId);
      if (playerIndex != -1) {
        gameServer.waitingGames[gameIndex].projectiles.push(new TankWarsProjectile(this.gameId, this.playerId, gameServer.waitingGames[gameIndex].players[playerIndex].pos, gameServer.waitingGames[gameIndex].players[playerIndex].shape.rotation));
        gameServer.waitingGames[gameIndex].ioUpdate.newProjectiles.push(gameServer.waitingGames[gameIndex].projectiles[gameServer.waitingGames[gameIndex].projectiles.length-1]);
      }
    }
  }
}
//      SUPER CLASS: TankWarsProjectile
class TankWarsProjectile {
  constructor(gameId, playerId, pos, rotation) {
    this.type = this.constructor.name;
    this.gameId = gameId;
    this.playerId = playerId;
    this.pos = new Vector2D(pos.x, pos.y);
    this.vel = vector2DFromAngle(rotation);
    this.life = 20;
    this.radius = 0.1;

    this.speed = 2.31;
    

    let index = gameServer.waitingGames.findIndex(game => game.id === gameId);
    if (index != -1) {
      this.id = gameServer.waitingGames[index].totalProjectileCounter;
      gameServer.waitingGames[index].totalProjectileCounter ++;
    } else {
      terminal.critical("fail in tankwarsprojectile constructer")
    }
  }
  applyPhysics() {
    this.pos.add(this.vel.magnitude(this.speed * gameServer.physicTimeStep));
  }
  lifeIsOver() {
    this.life -= gameServer.physicTimeStep;
    if (this.life < 0) {
      return true;
    }
    return false;
  }
  getIoUpdateData() {
    return {
      id: this.id,
      pos: this.pos,
      vel: this.vel
    }
  }
}
























//---------------------------------------------------------------//
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                               IO                              //
//                                                               //
//---------------------------------------------------------------//



//      Client input handling
io.sockets.on('connection',

  function(socket) {

    socket.on('enlistForMonitoringUpdates',
      function(data) {
        gameServer.connectedClients.push(new Client(socket.id, 'monitoringOpperator'))
        terminal.log("Opperator connected using id: "+socket.id)
        gameServer.statistic.liveMonitoringOperators.push(gameServer.connectedClients[gameServer.connectedClients.length-1]);
        socket.join('monitoringOpperators');
      }
    );
    socket.on('latencyCheck',
      function(data) {
        io.to(`${socket.id}`).emit('latencyCheckResponse', {});
      }
    );
    socket.on('getGameServer',
      function(data) {
        io.to(`${socket.id}`).emit('getGameServerResponse', gameServer);
      }
    );


    //      Connect to Game
    socket.on('connectToGame',
      function(data) {
        gameServer.connectedClients.push(new Client(socket.id, 'player', data.isOnMobile))

        let index = gameServer.waitingGames.findIndex(game => game.type === data.type && game.players.length < game.maxAmountOfPlayers && game.allowJoiningWithoutPartyCode === true);
        if (index == -1) {
          terminal.log("Creating new " + data.type + " by Client: " + socket.id);
          gameServer.newGame(data.type);
          index = gameServer.waitingGames.length-1;
          gameServer.waitingGames[index].addPlayer(socket.id);
        } else {
          terminal.log(socket.id + " joined " + data.type + " by the id: " + gameServer.waitingGames[index].id);
          gameServer.waitingGames[index].addPlayer(socket.id);
          // console.log(gameServer.waitingGames[index].players);
          gameServer.waitingGames[index].ioUpdate.newPlayers.push(gameServer.waitingGames[index].players[gameServer.waitingGames[index].players.length-1]);
        }
        
        socket.join(gameServer.waitingGames[index].id);
        io.to(`${socket.id}`).emit('connectedToGame', gameServer.waitingGames[index]);
      }
    );

    //      Handle Client Input
    socket.on('clientInput',
      function(data) {
        let index = gameServer.getClientIndexById(socket.id)
        if (index != -1) {
          gameServer.connectedClients[index].player.handleClientInput(data);
        }
      }
    );

    
    

    socket.on('disconnect', function() {
      let index = gameServer.getClientIndexById(socket.id);
      terminal.log(gameServer.connectedClients[index].hasFunction + " disconnected id was: " + socket.id)

      //      Disconnect LMO
      if (gameServer.connectedClients[index].hasFunction == "monitoringOpperator") {
        let index2 = gameServer.getLiveMonitoringOpperatorIndexById(socket.id);
        gameServer.statistic.liveMonitoringOperators.splice(index2, 1);
      }
      

      //      Disconnect Player
      else if (gameServer.connectedClients[index].hasFunction == "player") {
        let indexAndState = gameServer.getGameIndexAndStateByPlayerId(socket.id);

        //      Clear Player from WAITING game || *inProgress > transfer to ..Game.removePlayer()
        if (indexAndState.index != -1 && indexAndState.state == "waiting") {
          let index2 = gameServer.waitingGames[indexAndState.index].getPlayerIndexById(socket.id);
          gameServer.waitingGames[indexAndState.index].ioUpdate.removePlayers.push(gameServer.waitingGames[indexAndState.index].players[index2]);
          gameServer.waitingGames[indexAndState.index].players.splice(index2, 1);
          gameServer.statistic.onlinePlayers--;
          //      Delet entire game if all players left
          if (gameServer.waitingGames[indexAndState.index].players.length <= 0) {
            terminal.log("Closing game by id: " + gameServer.waitingGames[indexAndState.index].id + " since all players left");
            gameServer.waitingGames.splice(indexAndState.index, 1);
            gameServer.statistic.activeGames--;
          }
        }
        
        //      Clear Player from RUNNING game || *inProgress > transfer to ..Game.removePlayer()
        else if (indexAndState.index != -1 && indexAndState.state == "running") {
          let index2 = gameServer.runningGames[indexAndState.index].getPlayerIndexById(socket.id);
          gameServer.runningGames[indexAndState.index].ioUpdate.removePlayers.push(gameServer.runningGames[indexAndState.index].players[index2]);
          gameServer.runningGames[indexAndState.index].players.splice(index2, 1);
          gameServer.statistic.onlinePlayers--;
          //      Delet entire game if all players left
          if (gameServer.runningGames[indexAndState.index].players.length <= 0) {
            terminal.log("Closing game by id: " + gameServer.runningGames[indexAndState.index].id + " since all players left");
            gameServer.runningGames.splice(indexAndState.index, 1);
            gameServer.statistic.activeGames--;
          }
        }
      }

      gameServer.connectedClients.splice(index, 1);
    });


  }
);
terminal.log("listening @ IP: "+ip+":"+port);














//      Starting Mainloop
terminal.log("Starting Mainloop");
terminal.break();
gameServer.main();
