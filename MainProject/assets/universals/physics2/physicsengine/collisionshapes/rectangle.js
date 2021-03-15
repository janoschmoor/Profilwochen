const Vector2D = require("../../lib/vector2d")

class Rectangle extends Array {
    constructor(width, height) {
        super(
            new Vector2D(-width / 2, -height / 2),
            new Vector2D(width / 2, -height / 2),
            new Vector2D(width / 2, height / 2),
            new Vector2D(-width / 2, height / 2)
            );
    }
}
module.exports = Rectangle;