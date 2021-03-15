// class VertexBuilder {
//     constructor(vertexBuilder) {
//         this = vertexBuilder;
        
//     }
// }









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
class Rectangle extends Array {
    constructor(height, width) {
        super(
            new Vector2D(-width / 2, -height / 2),
            new Vector2D(width / 2, -height / 2),
            new Vector2D(width / 2, height / 2),
            new Vector2D(-width / 2, height / 2)
            );
    }
}
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


Array.prototype.calculateMass = function() {
    let mass = 0;
    for (let i = 0; i < this.length; i++) {
        mass += this[i].crossProduct(this[(i + 1) % this.length]) * Math.sin(this[i].simpleInteriorAngle(this[(i + 1) % this.length])) / 2;
    }
    return mass;
}
Array.prototype.render = function(pos, vertecies) {
    translate(pos.x * me.scope, pos.y * me.scope);
    beginShape();
    for (let i = 0; i < vertecies.length; i++) {
        vertex(vertecies[i].x * me.scope, vertecies[i].y * me.scope);
    }
    endShape(CLOSE);
    translate(-pos.x * me.scope, -pos.y * me.scope);
}