const Vector2D = require("../../universals/vector2d");
const TankWars = require("./tankwars.js");

class TankWarsProjectile {
	constructor(pos, maxSpeed, angle, radius, life, playerId, playerTeam, cell, gameId, effect = false) {
        this.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		this.pos = new Vector2D(pos.x, pos.y);
        this.angle = angle;
        this.maxSpeed = maxSpeed;
        this.vel = Vector2D.fromAngle(this.angle).magnitude(this.maxSpeed);
        this.radius = radius;
        this.damage = (this.vel.magnitude() * this.vel.magnitude() * this.radius) / 3000;
        this.life = life;

        this.shooterId = playerId;
        this.shooterTeam = playerTeam;
        this.currentCell = new Vector2D(cell.x, cell.y);
        this.oldCell = new Vector2D(cell.x, cell.y);
        this.gameId = gameId;

        this.effect = effect;

        let posOffset = new Vector2D(this.vel.x, this.vel.y).magnitude(20 + this.radius);
        this.pos.add(posOffset);

        // console.log(new TankWars());
    }

    update() {
        this.pos.add(this.vel.magnitude(this.maxSpeed * server.physicsTimeStep / 1000));
        this.life -= 1;

        let index = server.games.findIndex(game => game.id === this.gameId);
        if (index != -1) {
            this.oldCell.set(this.currentCell.x, this.currentCell.y);
            this.currentCell = this.getCell(index);

            if (this.oldCell.x != this.currentCell.x || this.oldCell.y != this.currentCell.y) {

                // console.log(this.oldCell, this.currentCell);

                if (this.oldCell.x < 0 || this.oldCell.x >= server.games[index].map.size.x || this.oldCell.y < 0 || this.oldCell.y >= server.games[index].map.size.y) {
                    this.life = 0;
                    return;
                }

                if (this.currentCell.x > this.oldCell.x) { // moving right
                    if (server.games[index].map.cells[this.oldCell.x][this.oldCell.y].walls[1] == true) {
                        this.pos.sub(this.vel.magnitude(this.maxSpeed * server.physicsTimeStep / 1000));
                        this.vel.x *= -1;
                    }
                }
                if (this.currentCell.x < this.oldCell.x) { // moving left
                    if (server.games[index].map.cells[this.oldCell.x][this.oldCell.y].walls[3] == true) {
                        this.pos.sub(this.vel.magnitude(this.maxSpeed * server.physicsTimeStep / 1000));
                        this.vel.x *= -1;
                    }
                }
                if (this.currentCell.y > this.oldCell.y) { // moving bottom
                    if (server.games[index].map.cells[this.oldCell.x][this.oldCell.y].walls[2] == true) {
                        this.pos.sub(this.vel.magnitude(this.maxSpeed * server.physicsTimeStep / 1000));
                        this.vel.y *= -1;
                    }
                }
                if (this.currentCell.y < this.oldCell.y) { // moving top
                    if (server.games[index].map.cells[this.oldCell.x][this.oldCell.y].walls[0] == true) {
                        this.pos.sub(this.vel.magnitude(this.maxSpeed * server.physicsTimeStep / 1000));
                        this.vel.y *= -1;
                    }
                }

                this.oldCell.set(this.currentCell.x, this.currentCell.y);
                this.currentCell = this.getCell(index);
            }
        }
    }

    getCell(index) {
        if (index != -1) {
            let vec = new Vector2D(Math.floor(this.pos.x / server.games[index].map.cellSize), Math.floor(this.pos.y / server.games[index].map.cellSize));
            if (vec.x >= -1 && vec.x < server.games[index].map.size.x + 1 && vec.y >= -1 && vec.y < server.games[index].map.size.y + 1) {
                return vec;
            }
        }
        return false;
    }

    getUpdate () {
        return {id: this.id, pos: this.pos, vel: this.vel, radius: this.radius};
    }
}
module.exports = TankWarsProjectile;