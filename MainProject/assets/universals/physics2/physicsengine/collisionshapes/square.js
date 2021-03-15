class Square extends Array {
    constructor(scale = 10) {
        super(
            new Vector2D(-scale, -scale),
            new Vector2D(scale, -scale),
            new Vector2D(scale, scale),
            new Vector2D(-scale, scale)
            );
    }
}
module.exports = Square;