class Projectile {
    constructor(projectile) {
        this.id = projectile.id;
        this.pos = new Vector2D(projectile.pos.x, projectile.pos.y);
        this.vel = new Vector2D(projectile.vel.x, projectile.vel.y);
        this.radius = projectile.radius;
        this.maxSpeed = projectile.maxSpeed;
        this.shooterId = projectile.shooterId;

        this.oldCell = this.getCell();
        this.currentCell = this.getCell();

        this.effect = projectile.effect;

        this.circle = two.makeCircle(this.pos.x, this.pos.y, this.radius);
        let index = game.players.findIndex(player => player.id === this.shooterId);
        if (index != -1) {
            this.circle.fill = game.players[index].rect.fill;
        }
        foreground.add(this.circle);
    }

    update(data) {
        this.pos = new Vector2D(data.pos.x, data.pos.y);
        this.vel = new Vector2D(data.vel.x, data.vel.y);
    }
    estimate() {
        if (game.physicsTimeStep > 0) {
            let vel = new Vector2D(this.vel.x, this.vel.y);
            this.pos.add(vel.magnitude(this.maxSpeed * game.physicsTimeStep / 1000));
        }
    }
    collision () {
        this.oldCell.set(this.currentCell.x, this.currentCell.y);
        this.currentCell = this.getCell();

        if (this.oldCell.x != this.currentCell.x || this.oldCell.y != this.currentCell.y) {

            // console.log(this.oldCell, this.currentCell);

            if (this.oldCell.x < 0 || this.oldCell.x >= game.map.size.x || this.oldCell.y < 0 || this.oldCell.y >= game.map.size.y) {
                return;
            }

            let detected = false;

            if (this.currentCell.x > this.oldCell.x) { // moving right
                if (game.map.cells[this.oldCell.x][this.oldCell.y].walls[1] == true) {
                    this.pos.sub(this.vel.magnitude(this.maxSpeed * game.physicsTimeStep / 1000));
                    this.vel.x *= -1;
                    detected = true;
                }
            }
            if (this.currentCell.x < this.oldCell.x) { // moving left
                if (game.map.cells[this.oldCell.x][this.oldCell.y].walls[3] == true) {
                    this.pos.sub(this.vel.magnitude(this.maxSpeed * game.physicsTimeStep / 1000));
                    this.vel.x *= -1;
                    detected = true;
                }
            }
            if (this.currentCell.y > this.oldCell.y) { // moving bottom
                if (game.map.cells[this.oldCell.x][this.oldCell.y].walls[2] == true) {
                    this.pos.sub(this.vel.magnitude(this.maxSpeed * game.physicsTimeStep / 1000));
                    this.vel.y *= -1;
                    detected = true;
                }
            }
            if (this.currentCell.y < this.oldCell.y) { // moving top
                if (game.map.cells[this.oldCell.x][this.oldCell.y].walls[0] == true) {
                    this.pos.sub(this.vel.magnitude(this.maxSpeed * game.physicsTimeStep / 1000));
                    this.vel.y *= -1;
                    detected = true;
                }
            }

            if (!detected) {
                
            }

            this.oldCell.set(this.currentCell.x, this.currentCell.y);
            this.currentCell = this.getCell();
        }
    }

    getCell() {

        let vec = new Vector2D(Math.floor(this.pos.x / game.map.cellSize), Math.floor(this.pos.y / game.map.cellSize));
        if (vec.x >= -1 && vec.x < game.map.size.x + 1 && vec.y >= -1 && vec.y < game.map.size.y + 1) {
            return vec;
        }
        return false;
    }
}