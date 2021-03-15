const Vector2D = require("../../universals/vector2d");
const Client = require("../../server/client.js");
const Terminal = require("../../universals/terminal.js");
const TankWarsProjectile = require("./tankwarsprojectile.js");

const TankWarsWeapon = require("./tankwarsweapons.js")[0];
const Shotgun = require("./tankwarsweapons.js")[1];
const Machinegun = require("./tankwarsweapons.js")[2];
const SpecialWeapon = require("./tankwarsweapons.js")[3];


class TankWarsPlayer extends Client {
    constructor(id, game, isMobile) {
        super(id, game, isMobile);

        this.pos = new Vector2D(0, 0);
        this.teleportRandom();
        this.vel = new Vector2D(0,0);
        this.size = new Vector2D(30, 18);
        this.scope = 1;
        this.maxSpeed = 140;
        this.angle = 0;
        this.angleSpeed = Math.PI * 2;
        this.health = 100;
        this.dead = false;
        this.color = undefined;
        this.effects = {freeze: {bool: false, countdown: 0}, slowdown: {bool: false, countdown: 0}, speed: {bool: false, countdown: 0}}

        this.kills = 0;
        this.weapon = new TankWarsWeapon(1);
        this.tier = 1;
        this.state = "playing";

        this.currentCell = this.getCell();
        this.oldCell = this.getCell();

        this.radius = 5;

        terminal.log(id + " connected");
    }

    move() {
        if (this.state == "playing") {

            if (this.effects.slowdown.bool == true) {
                this.m = 0.25;
            } else {
                this.m = 1;
            }

            if (this.tier == 3 && this.weapon.name == "SpecialWeapon") {
                this.m = 2;
            }

            this.oldCell.set(this.currentCell.x, this.currentCell.y);
            this.currentCell = this.getCell();

            this.vel = new Vector2D(0,0);
            if (this.isMobile && this.clientInput.pointer) {
                let tempVec = new Vector2D(this.clientInput.pointer.x, this.clientInput.pointer.y)
                if (tempVec.magnitude() > 0) {
                    // update angle
                    // let interiorAngle = tempVec.interiorAngle(Vector2D.fromAngle(this.angle));
                    // console.log(interiorAngle);
    
                    // update vel
                    
                    // this.vel.set(this.clientInput.pointer.x, this.clientInput.pointer.y);
                    // this.vel.magnitude(this.maxSpeed * (server.physicsTimeStep / 1000));

                    tempVec.magnitude(this.maxSpeed * (server.physicsTimeStep / 1000) * this.m);
                    this.vel = new Vector2D(tempVec.x, tempVec.y);
                    this.angle = tempVec.interiorAngle(new Vector2D(1,0));
                    if (this.clientInput.pointer.y < 0) {
                        this.angle *= -1;
                    }
    
                }   
            } else {
                if (this.clientInput.a) {
                    this.angle -= this.angleSpeed * server.physicsTimeStep / 1000 * this.m;
                }
                if (this.clientInput.d) {
                    this.angle += this.angleSpeed * server.physicsTimeStep / 1000 * this.m;
                }
                if (this.clientInput.w) {
                    this.vel.add(Vector2D.fromAngle(this.angle).magnitude(this.maxSpeed * (server.physicsTimeStep / 1000) * this.m));
                }
                if (this.clientInput.s) {
                    this.vel.add(Vector2D.fromAngle(this.angle).magnitude(-0.6 * this.maxSpeed * (server.physicsTimeStep / 1000) * this.m));
                }
            }
            
            if (this.vel.magnitude() > 0) {
                this.pos.add(this.vel);
            }
        }
    }

    collisionCheck() {
        let fractionAngle = Math.atan(this.size.y / this.size.x);
        let mag = Math.sqrt((this.size.x/2) * (this.size.x/2) + (this.size.y/2) * (this.size.y/2));
        let corners = [
            new Vector2D(this.pos.x, this.pos.y).add(Vector2D.fromAngle(this.angle + fractionAngle).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(Vector2D.fromAngle(this.angle - fractionAngle).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(Vector2D.fromAngle(this.angle + fractionAngle + Math.PI).magnitude(mag)),
            new Vector2D(this.pos.x, this.pos.y).add(Vector2D.fromAngle(this.angle - fractionAngle + Math.PI).magnitude(mag))
        ]
        for (let i = 0; i < 4; i++) { // for all 4 corners
            let corner = corners[i];
            let cell = new Vector2D(Math.floor(corner.x / this.game.map.cellSize), Math.floor(corner.y / this.game.map.cellSize));
            if (cell.x >= -1 && cell.x < this.game.map.size.x + 1 && cell.y >= -1 && cell.y < this.game.map.size.y + 1) {
                if (cell.x != this.currentCell.x || cell.y != this.currentCell.y) { // true: collision
                    
                    if (cell.x > this.currentCell.x) { // is right
                        if (this.game.map.cells[this.currentCell.x][this.currentCell.y].walls[1] == true) {
                            this.pos.x -= corner.x - this.game.map.cellSize * (this.currentCell.x + 1 );
                        }
                    }
                    if (cell.x < this.currentCell.x) { // is left
                        if (this.game.map.cells[this.currentCell.x][this.currentCell.y].walls[3] == true) {
                            this.pos.x += this.game.map.cellSize * (this.currentCell.x) - corner.x;
                        }
                    }
                    if (cell.y > this.currentCell.y) { // is down
                        if (this.game.map.cells[this.currentCell.x][this.currentCell.y].walls[2] == true) {
                            this.pos.y -= corner.y - this.game.map.cellSize * (this.currentCell.y + 1 );
                        }
                    }
                    if (cell.y < this.currentCell.y) { // is up
                        if (this.game.map.cells[this.currentCell.x][this.currentCell.y].walls[0] == true) {
                            this.pos.y +=  this.game.map.cellSize * (this.currentCell.y) - corner.y;
                        }
                    }

                }
            }
            
        }
    }

    getCell() {
        let vec = new Vector2D(Math.floor(this.pos.x / this.game.map.cellSize), Math.floor(this.pos.y / this.game.map.cellSize));
        if (vec.x >= 0 && vec.x < this.game.map.size.x && vec.y >= 0 && vec.y < this.game.map.size.y) {
            return vec;
        } else {
            return false;
        }
    }

    updateEffects() {
        if (this.effects.freeze.bool) {
            this.effects.freeze.countdown -= 1;
            if (this.effects.freeze.countdown <= 0) {
                this.effects.freeze.bool = false;
                this.game.nextUpdate.specials.push({type: "endFreeze", id: this.id});
                this.state = "playing";
                this.teleportRandom();
                this.health = 100;
                this.dead = false;
                this.weapon.currentAmmo = this.weapon.maxAmmo;
            }
        } else if (this.effects.slowdown.bool) {
            this.effects.slowdown.countdown -= 1;
            if (this.effects.slowdown.countdown <= 0) {
                this.effects.slowdown.bool = false;
                this.game.nextUpdate.specials.push({type: "endSlowdown", id: this.id});
            }
        } else if (this.effects.speed.bool) {
            
        }
    }

    hit(projectileIndex) {
        if (this.state == "playing") {
            let projectile = this.game.projectiles[projectileIndex];
            this.health -= projectile.damage;
            server.io.to(this.game.id).emit("deleteProjectile", projectile.id);
            this.game.nextUpdate.specials.push({type: "projectileHit", pos: new Vector2D(projectile.pos.x, projectile.pos.y), dir: new Vector2D(projectile.pos.x - this.pos.x, projectile.pos.y - this.pos.y), color: this.color});
            if (projectile.effect == "slowdown") {
                this.effects.slowdown.bool = true;
                this.effects.slowdown.countdown = 100;
                this.game.nextUpdate.specials.push({type: "startSlowdown", id: this.id});
            } else if(projectile.effect == "teleport") {
                this.teleportRandom();
            }
            if (this.health <= 0.1 && !this.dead) {
                let index = this.game.players.findIndex(player => player.id == this.game.projectiles[projectileIndex].shooterId);
                if (this != this.game.players[index]) {
                    if (this.game.players[index].weapon.nextWeapon == "TankWarsWeapon") {
                        this.game.players[index].tier += 1;
                    }
                    if (this.game.players[index].weapon.nextWeapon == "SpecialWeapon" && this.game.players[index].tier == 3) {
                        this.game.nextUpdate.specials.push({type: "startSpeed", id: this.game.players[index].id});

                    }
                    this.game.players[index].weapon = eval("new " + this.game.players[index].weapon.nextWeapon + `(${this.game.players[index].tier})`);
                    this.game.nextUpdate.specials.push({id: this.game.players[index].id, weapon: this.game.players[index].weapon, type: "newWeapon", tier: this.game.players[index].tier});
                    this.game.players[index].health += (100 - this.game.players[index].health) / 2;
                    this.game.players[index].kills += 1;       
                }
                this.dead = true;
            }
            this.game.projectiles.splice(projectileIndex, 1);
        }
    }
    
    shootCheck() {
        if (this.state == "playing") {
            if (this.clientInput.shoot) {
                this.weapon.shoot(this);
            }
            if (this.weapon.cooldown > 0) {
                this.weapon.cooldown -= 1;
            }
            if (this.weapon.currentAmmo < this.weapon.maxAmmo) {
                this.weapon.reloadTime --;
                if (this.weapon.reloadTime <= 0) {
                    this.weapon.reloadTime = this.weapon.maxReloadTime;
                    this.weapon.currentAmmo ++;
                }
            }
        }
    }

    getUpdate() {
        return {
			id: this.id,
            pos: this.pos,
            vel: this.vel,
            health: this.health,
            angle: this.angle,
            kills: this.kills,
            currentAmmo: this.weapon.currentAmmo,
            maxAmmo: this.weapon.maxAmmo
        }
    }

    returnSelf() {
        return {id: this.id, pos: this.pos, vel: this.vel, size: this.size, maxSpeed: this.maxSpeed,
                angle: this.angle, angleSpeed: this.angleSpeed, scope: this.scope, weapon: this.weapon,
                health: this.health, state: this.state, color: this.color, effects: this.effects};
    }

    teleportRandom() {
        this.pos.x = Math.floor(Math.random() * this.game.map.size.x) * this.game.map.cellSize + this.game.map.cellSize / 2;
        this.pos.y = Math.floor(Math.random() * this.game.map.size.y) * this.game.map.cellSize + this.game.map.cellSize / 2;
    }

    reset() {
        this.pos = new Vector2D(0, 0);
        this.teleportRandom();
        this.vel = new Vector2D(0,0);
        this.size = new Vector2D(30, 18);
        this.scope = 1;
        this.maxSpeed = 140;
        this.angle = 0;
        this.angleSpeed = Math.PI * 2;
        this.health = 100;
        this.dead = false;
        this.color = undefined;

        this.team = undefined;
        this.kills = 0;
        this.weapon = new TankWarsWeapon(1);
        this.tier = 1;
        this.state = "playing";
    }
}

module.exports = TankWarsPlayer;