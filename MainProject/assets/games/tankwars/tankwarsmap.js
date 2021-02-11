const Vector2D = require("../../universals/vector2d");
const TankWarsCell = require("./tankwarscell.js");

class TankWarsMap {
    constructor() {
        this.size = new Vector2D(Math.floor(Math.random() * 5 + 7), Math.floor(Math.random() * 5 + 7));
        // this.size = new Vector2D(15, 15);
        this.cellSize = 50;
        this.tolerance = Math.random() / 5 + 0.8;
        // this.tolerance = 1;

        this.cells = [];
        for (let x = 0; x < this.size.x; x++) {
            this.cells.push([]);
            for (let y = 0; y < this.size.y; y++) {
                this.cells[x].push(new TankWarsCell(x, y));
            }
        }

        this.init(5,5);

    }
    init(x, y) {
        this.cells[x][y].hasBeenInitalized = true;
        let direction = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            if (direction == 0 && y - 1 >= 0) {
                if (this.cells[x][y - 1].hasBeenInitalized == false) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x][y - 1].breakWall((direction + 2) % 4);
                    this.init(x, y - 1);
                }
                else if (Math.random() > this.tolerance) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x][y - 1].breakWall((direction + 2) % 4);
                }
            }
            else if (direction == 1 && x + 1 < this.size.x) {
                if (this.cells[x + 1][y].hasBeenInitalized == false) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x + 1][y].breakWall((direction + 2) % 4);
                    this.init(x + 1, y);
                }
                else if (Math.random() > this.tolerance) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x + 1][y].breakWall((direction + 2) % 4);
                }
            }
            else if (direction == 2 && y + 1 < this.size.y) {
                if (this.cells[x][y + 1].hasBeenInitalized == false) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x][y + 1].breakWall((direction + 2) % 4);
                    this.init(x, y + 1);
                }
                else if (Math.random() > this.tolerance) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x][y + 1].breakWall((direction + 2) % 4);
                }
            }
            else if (direction == 3 && x - 1 >= 0) {
                if (this.cells[x - 1][y].hasBeenInitalized == false) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x - 1][y].breakWall((direction + 2) % 4);
                    this.init(x - 1, y);
                }
                else if (Math.random() > this.tolerance) {
                    this.cells[x][y].breakWall(direction);
                    this.cells[x - 1][y].breakWall((direction + 2) % 4);
                }
            }
            
            direction = (direction + 1) % 4;
        }
    }

}
module.exports = TankWarsMap;