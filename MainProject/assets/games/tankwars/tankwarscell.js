const Vector2D = require('../../universals/vector2d.js')

class TankWarsCell {
    constructor(x, y) {
        this.pos = new Vector2D(x, y);
        this.hasBeenInitalized = false;
        this.walls = [true, true, true, true];
    }
    breakWall(direction) {
        this.walls[direction] = false;
    }
}
module.exports = TankWarsCell;