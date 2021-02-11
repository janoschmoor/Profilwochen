class Map {
    constructor(map) {
        this.cells = map.cells;
        this.size = map.size;
        this.cellSize = map.cellSize;
        
        for (let x = 0; x < this.cells.length; x++) {
            for (let y = 0; y < this.cells[x].length; y++) {
                let cell = this.cells[x][y];
                if (cell.walls[0] == true) {
                    cell.lineTop = new Two.Line(
                        cell.pos.x * this.cellSize,
                        cell.pos.y * this.cellSize,
                        (cell.pos.x + 1) * this.cellSize,
                        cell.pos.y * this.cellSize);
                    background.add(cell.lineTop);
                }
                if (cell.walls[3] == true) {
                    cell.lineLeft = new Two.Line(
                        cell.pos.x * this.cellSize,
                        cell.pos.y * this.cellSize,
                        cell.pos.x * this.cellSize,
                        (cell.pos.y + 1) * this.cellSize);
                    background.add(cell.lineLeft);
                }
            }
        }
        this.rightLine = new Two.Line(0, this.size.y * this.cellSize, this.size.x * this.cellSize, this.size.y * this.cellSize);
        this.bottomLine = new Two.Line(this.size.x * this.cellSize, 0, this.size.x * this.cellSize, this.size.y * this.cellSize)
        background.add(this.bottomLine, this.rightLine);
    }

    render(xOffset, yOffset) {
        for (let x = 0; x < this.cells.length; x++) {
            for (let y = 0; y < this.cells[x].length; y++) {
                let cell = this.cells[x][y];
                if (cell.walls[0] == true) {
                    cell.lineTop.scale = me.scope;
                    cell.lineTop.translation.set(xOffset + cell.pos.x * me.scope - x * me.scope, yOffset + cell.pos.y * me.scope - y * me.scope);
                }
                if (cell.walls[3] == true) {
                    cell.lineLeft.scale = me.scope;
                    cell.lineLeft.translation.set(xOffset + cell.pos.x * me.scope - x * me.scope, yOffset + cell.pos.y * me.scope - y * me.scope);
                }
            }
        }
        this.bottomLine.scale = me.scope;
        this.rightLine.scale = me.scope;
        this.bottomLine.translation.set(xOffset, yOffset);
        this.rightLine.translation.set(xOffset, yOffset);
        // this.players[i].rect.translation.set(xOffset + this.players[i].pos.x * me.scope, yOffset + this.players[i].pos.y * me.scope);
        // this.players[i].rect.scale = me.scope;
    }
}