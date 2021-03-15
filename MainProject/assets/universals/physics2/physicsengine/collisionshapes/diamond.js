class Diamond extends Array {
    constructor(scale = 10) {
        super(
            vector2DfromAngle(Math.PI + 0.4).magnitude(scale*0.9),
            vector2DfromAngle(- 0.4).magnitude(scale*0.9),
            vector2DfromAngle(0).magnitude(scale),
            vector2DfromAngle(Math.PI / 2).magnitude(scale),
            vector2DfromAngle(Math.PI).magnitude(scale)
            );
    }
}
module.exports = Diamond;