class Polygon extends Array {
    constructor(scale = 10) {
        super(
            vector2DfromAngle(0).magnitude(scale),
            vector2DfromAngle(Math.PI * 2 / 5*1).magnitude(scale),
            vector2DfromAngle(Math.PI * 2 / 5*2).magnitude(scale),
            vector2DfromAngle(Math.PI * 2 / 5*3).magnitude(scale),
            vector2DfromAngle(Math.PI * 2 / 5*4).magnitude(scale)
            );
    }
}
module.exports = Polygon;