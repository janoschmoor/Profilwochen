const Vector2D = require("../lib/vector2d");

class Collider {
    constructor(physicsWorld, id, color, pos, vertexBuilder, angle = 0, mass = 0) {
        this.physicsWorld = physicsWorld;
        this.id = id;

        this.pos = pos;
        this.vertexBuilder = vertexBuilder;
        this.angle = angle;

        this.vertecies = [];
        this.boundingBox = {relativePos: new Vector2D(0,0), size: new Vector2D(0,0)}
        this.buildVertecies();

        if (mass) {
            this.mass = 0;
            for (let i = 0; i < this.vertecies.length; i++) {
                this.mass += this.vertecies[i].crossProduct(this.vertecies[(i + 1) % this.vertecies.length]) * Math.sin(this.vertecies[i].simpleInteriorAngle(this.vertecies[(i + 1) % this.vertecies.length])) / 2;
            }
        } else {
            this.mass = mass;
        }
        
        this.elasticity = 0.00001;
        this.staticFrition = 0;

        this.sleep = false;
        this.isActive = false;

        this.collidesActive = true;
        
        this.color = color;

        this.type = this.constructor.name;
    }
}

// Collider.prototype.render = function () {
//     translate(this.pos.x, this.pos.y);
//     beginShape();
//     for (let i = 0; i < this.vertecies.length; i++) {
//         vertex(this.vertecies[i].x, this.vertecies[i].y);
//     }
//     endShape(CLOSE);
//     translate(-this.pos.x, -this.pos.y);
// }
Collider.prototype.setTranslation = function (x, y) {
    this.pos.set(x, y);
    this.vel.set(0, 0);
}
Collider.prototype.customRun = function() {
    
}

Collider.prototype.buildVertecies = function () {
    this.vertecies = [];
    for (let i = 0; i < this.vertexBuilder.length; i++) {
        this.vertecies.push(new Vector2D(Math.cos(this.angle) * this.vertexBuilder[i].x - Math.sin(this.angle) * this.vertexBuilder[i].y, Math.sin(this.angle) * this.vertexBuilder[i].x + Math.cos(this.angle) * this.vertexBuilder[i].y));
    }
    this.updateBoundingBox();
}

Collider.prototype.rotate = function (angle) {
    this.angle += angle;
    this.buildVertecies();
}

Collider.prototype.updateBoundingBox = function () {
    let _max = new Vector2D(-1000000000, -1000000000);
    let _min = new Vector2D(1000000000, 1000000000);

    for (let i = 0; i < this.vertecies.length; i++) {
        if (this.vertecies[i].x > _max.x) {_max.x = this.vertecies[i].x;}
        if (this.vertecies[i].y > _max.y) {_max.y = this.vertecies[i].y;}
        if (this.vertecies[i].x < _min.x) {_min.x = this.vertecies[i].x;}
        if (this.vertecies[i].y < _min.y) {_min.y = this.vertecies[i].y;}
    }
    this.boundingBox.relativePos = _min;
    this.boundingBox.size.set(_max.x - _min.x, _max.y - _min.y);
}

Collider.prototype.performBoundingBoxCollision = function(other) {
    if (
        this.pos.x + this.boundingBox.relativePos.x < other.pos.x + other.boundingBox.relativePos.x + other.boundingBox.size.x &&
        this.pos.x + this.boundingBox.relativePos.x + this.boundingBox.size.x > other.pos.x + other.boundingBox.relativePos.x &&
        this.pos.y + this.boundingBox.relativePos.y < other.pos.y + other.boundingBox.relativePos.y + other.boundingBox.size.y &&
        this.pos.y + this.boundingBox.relativePos.y + this.boundingBox.size.y > other.pos.y + other.boundingBox.relativePos.y
    ) {
        return true;
    }
}

Collider.prototype.performSAT = function (other) {
    // use this. projectionaxis
    for (let thisProjectionVertexIndex = 0; thisProjectionVertexIndex < this.vertecies.length; thisProjectionVertexIndex++) {
        let projectionAxis = new Vector2D(-(this.vertecies[(thisProjectionVertexIndex + 1) % this.vertecies.length].y - this.vertecies[thisProjectionVertexIndex].y), this.vertecies[(thisProjectionVertexIndex + 1) % this.vertecies.length].x - this.vertecies[thisProjectionVertexIndex].x);
        let otherMax = -1000000000;
        let otherMin = 1000000000;
        let thisMax = -1000000000;
        let thisMin = 1000000000;

        for (let otherVertexIndex = 0; otherVertexIndex < other.vertecies.length; otherVertexIndex++) {
            let projectionScalar = projectionAxis.scalarProduct(new Vector2D(other.vertecies[otherVertexIndex].x + other.pos.x, other.vertecies[otherVertexIndex].y + other.pos.y));
            if (projectionScalar > otherMax) {otherMax = projectionScalar;}
            if (projectionScalar < otherMin) {otherMin = projectionScalar;}
        }
        for (let thisVertexIndex = 0; thisVertexIndex < this.vertecies.length; thisVertexIndex++) {
            let projectionScalar = projectionAxis.scalarProduct(new Vector2D(this.vertecies[thisVertexIndex].x + this.pos.x, this.vertecies[thisVertexIndex].y + this.pos.y));
            if (projectionScalar > thisMax) {thisMax = projectionScalar;}
            if (projectionScalar < thisMin) {thisMin = projectionScalar;}
        }

        if (!((otherMax < thisMax && otherMax > thisMin) ||
            (otherMin < thisMax && otherMin > thisMin) ||
            (thisMax < otherMax && thisMax > otherMin) ||
            (thisMin < otherMax && thisMin > otherMin))
            ) {
            return false;
        }
    }

    // use other. projectionaxis
    for (let otherProjectionVertexIndex = 0; otherProjectionVertexIndex < other.vertecies.length; otherProjectionVertexIndex++) {
        let projectionAxis = new Vector2D(-(other.vertecies[(otherProjectionVertexIndex + 1) % other.vertecies.length].y - other.vertecies[otherProjectionVertexIndex].y), other.vertecies[(otherProjectionVertexIndex + 1) % other.vertecies.length].x - other.vertecies[otherProjectionVertexIndex].x);
        let otherMax = -1000000000;
        let otherMin = 1000000000;
        let thisMax = -1000000000;
        let thisMin = 1000000000;

        for (let otherVertexIndex = 0; otherVertexIndex < other.vertecies.length; otherVertexIndex++) {
            let projectionScalar = projectionAxis.scalarProduct(new Vector2D(other.vertecies[otherVertexIndex].x + other.pos.x, other.vertecies[otherVertexIndex].y + other.pos.y));
            if (projectionScalar > otherMax) {otherMax = projectionScalar;}
            if (projectionScalar < otherMin) {otherMin = projectionScalar;}
        }
        for (let thisVertexIndex = 0; thisVertexIndex < this.vertecies.length; thisVertexIndex++) {
            let projectionScalar = projectionAxis.scalarProduct(new Vector2D(this.vertecies[thisVertexIndex].x + this.pos.x, this.vertecies[thisVertexIndex].y + this.pos.y));
            if (projectionScalar > thisMax) {thisMax = projectionScalar;}
            if (projectionScalar < thisMin) {thisMin = projectionScalar;}
        }

        if (!((otherMax < thisMax && otherMax > thisMin) ||
            (otherMin < thisMax && otherMin > thisMin) ||
            (thisMax < otherMax && thisMax > otherMin) ||
            (thisMin < otherMax && thisMin > otherMin))
            ) {
            return false;
        }
    }

    return true;
}

Collider.prototype.performPointSAT = function(other) {
    let vertexIndecies = [];
    for (let thisVertexIndex = 0; thisVertexIndex < this.vertecies.length; thisVertexIndex++) {  
        let counter = 0;

        for (let otherProjectionVertexIndex = 0; otherProjectionVertexIndex < other.vertecies.length; otherProjectionVertexIndex++) {
            let projectionAxis = new Vector2D(-(other.vertecies[(otherProjectionVertexIndex + 1) % other.vertecies.length].y - other.vertecies[otherProjectionVertexIndex].y), other.vertecies[(otherProjectionVertexIndex + 1) % other.vertecies.length].x - other.vertecies[otherProjectionVertexIndex].x);
            let otherMax = -1000000000;
            let otherMin = 1000000000;
            let pointProjection = projectionAxis.scalarProduct(new Vector2D(this.vertecies[thisVertexIndex].x + this.pos.x, this.vertecies[thisVertexIndex].y + this.pos.y));
    
            for (let otherVertexIndex = 0; otherVertexIndex < other.vertecies.length; otherVertexIndex++) {
                let projectionScalar = projectionAxis.scalarProduct(new Vector2D(other.vertecies[otherVertexIndex].x + other.pos.x, other.vertecies[otherVertexIndex].y + other.pos.y));
                if (projectionScalar > otherMax) {otherMax = projectionScalar;}
                if (projectionScalar < otherMin) {otherMin = projectionScalar;}
            }
    
            if (otherMax > pointProjection && otherMin < pointProjection) {
                counter++;
            }
        }
        if (counter == other.vertecies.length) {
            vertexIndecies.push(thisVertexIndex);
            this.collisionVertexFound(thisVertexIndex, other);
            // return vertexIndecies
        }
    }
    return vertexIndecies;
}

Collider.prototype.collisionVertexFound = function(thisVertexIndex) {}
Collider.prototype.resetTouchingVertices = function() {}

Collider.prototype.getPositionCorrection = function(vertexIndex, other) {
    let v1WorldDir = new Vector2D(this.vertecies[vertexIndex].x / 2 + this.pos.x, this.vertecies[vertexIndex].y / 2 + this.pos.y);
    let temp = new Vector2D(v1WorldDir.x - other.pos.x, v1WorldDir.y - other.pos.y).magnitude(1000);
    v1WorldDir.set(other.pos.x + temp.x, other.pos.y + temp.y);
    // v2WorldPos is given by other.pos

    for (let otherVertexIndex = 0; otherVertexIndex < other.vertecies.length; otherVertexIndex++) {
        let v2WorldPos = new Vector2D(other.vertecies[otherVertexIndex].x + other.pos.x, other.vertecies[otherVertexIndex].y + other.pos.y);
        let v2WorldDir = new Vector2D(other.vertecies[(otherVertexIndex + 1) % other.vertecies.length].x - other.vertecies[otherVertexIndex].x + v2WorldPos.x, other.vertecies[(otherVertexIndex + 1) % other.vertecies.length].y - other.vertecies[otherVertexIndex].y + v2WorldPos.y);

        if (v1WorldDir.intersects(other.pos, v2WorldPos, v2WorldDir)) {
            let projectionAxis = v2WorldDir.sub(v2WorldPos);
            projectionAxis.set(projectionAxis.y, -projectionAxis.x);
            projectionAxis.normalize();

            let thisVertexProjection = projectionAxis.scalarProduct(new Vector2D(this.vertecies[vertexIndex].x + this.pos.x, this.vertecies[vertexIndex].y + this.pos.y));
            let otherVertexProjection = projectionAxis.scalarProduct(new Vector2D(other.vertecies[otherVertexIndex].x + other.pos.x, other.vertecies[otherVertexIndex].y + other.pos.y));
            let magnitude = Math.abs(otherVertexProjection - thisVertexProjection);

            if (magnitude == 0) {
                return new Vector2D(0,0);
            }

            return projectionAxis.magnitude(magnitude);
        }
    }
    console.error("notgut")
    return null;
}

Collider.prototype.updateMotionState = function() {
    if (this.mass) {
        // this.previousVel = new Vector2D(this.vel.x, this.vel.y);

        // console.log("physictimestep", physicsWorld.timestep, physicsWorld.gravity._magnitude(physicsWorld.timestep))
        this.acc.add(this.physicsWorld.gravity._magnitude(this.physicsWorld.gravity.magnitude() * this.physicsWorld.timestep));
        // console.log(this.acc.magnitude())
        // noLoop()

        this.vel.add(this.acc);
        this.vel.mult(this.drag);
        this.pos.add(this.vel._magnitude(this.vel.magnitude() * this.physicsWorld.timestep));
        this.rotate(this.angularVel * this.physicsWorld.timestep);


        this.acc.set(0,0);
    } else {
        console.error("cannot update motionstate of zero mass collider")
    }
}

Collider.prototype.hardPositionUpdate = function(correction) {
    this.pos.add(correction);
    // this.vel.set(0, 0);
}

Collider.prototype.angularMotionUpdate = function(angularProjection, vertex) {

    
    let deltaOmega = angularProjection / vertex.magnitude();
    this.angularVel += deltaOmega * this.physicsWorld.timestep;

    // noLoop()
    // console.log(angularProjection)
    
    // this.angularVel += angle * physicsWorld.timestep;
}

Collider.prototype.getAngularMotionCorrection = function(projectionAxis, vertexIndex) {
    let vertexProjection = projectionAxis.scalarProduct(this.vertecies[vertexIndex]._add(this.pos));
    let centerProjection = projectionAxis.scalarProduct(this.pos);

    let scalar = (centerProjection - vertexProjection);
    let angularMotionCorrection = scalar * (this.vertecies[vertexIndex].magnitude() ** 2) / this.mass;

    return angularMotionCorrection;
}

Collider.prototype.performCollision = function(other) {
    if (this.performBoundingBoxCollision(other)) {
        if (this.performSAT(other)) {
            if (other.collidesActive) {
                let theseVertexIndecies = this.performPointSAT(other);
                let otherVertexIndecies = other.performPointSAT(this);
    
                this.performSickMotionCalulation(other, theseVertexIndecies, otherVertexIndecies);
            }
            this.collisionDetected(other.id);
            other.collisionDetected(this.id);
        }
    }
}
Collider.prototype.collisionDetected = function(id) {
    
}

Collider.prototype.performSickMotionCalulation = function(other, theseVertexIndecies, otherVertexIndecies) {

    let translationCorrection = {vector: new Vector2D(0, 0), vertex: -1};
    for (let i = 0; i < theseVertexIndecies.length; i++) {
        let temp = this.getPositionCorrection(theseVertexIndecies[i], other);
        if (temp.magnitude() > translationCorrection.vector.magnitude()) {
            translationCorrection.vector = temp;
            translationCorrection.vertex = this.vertecies[theseVertexIndecies[i]];
        }
    }
    for (let i = 0; i < otherVertexIndecies.length; i++) {
        let temp = other.getPositionCorrection(otherVertexIndecies[i], this);
        temp.magnitude( - temp.magnitude());
        if (temp.magnitude() > translationCorrection.vector.magnitude()) {
            translationCorrection.vector = temp;
            translationCorrection.vertex = other.vertecies[otherVertexIndecies[i]];
        }
    }
    
    if (translationCorrection.vertex != -1) {
        if (translationCorrection.vector.magnitude() > 0) {

            // calculate Moment change
            // let momentPos = new Vector2D(this.pos.x + translationCorrection.vector.x, this.pos.y + translationCorrection.vector.y);
            // let directionalKineticEnergy = this.vel.magnitude() ** 2 * this.mass / 2;
            // let rotationalKineticEnergy = this.angularVel ** 2 * this.momentOfInertia / 2;
            // let angularComponent = this.getAngularVelocityVectorOfVertex(translationCorrection.vertex);
            // let momentDir = new Vector2D(this.vel.x + angularComponent.x, this.vel.y + angularComponent.y);

            // let velocityProjectionAxis = new Vector2D(-translationCorrection.vertex.x, -translationCorrection.vertex.y).normalize();
            // let angularProjectionAxis = new Vector2D(-translationCorrection.vertex.y, translationCorrection.vertex.x).normalize();

            // let angularProjection = angularProjectionAxis.scalarProduct(momentDir);
            // let velocityProjection = momentDir.magnitude() - angularProjection;
            // let velocityProjection = velocityProjectionAxis.scalarProduct(momentDir);


            // console.log(momentDir._magnitude())
            // this.vel.add(momentDir._magnitude(velocityProjection * (1 + this.elasticity)));
            // this.vel.add(new Vector2D(-translationCorrection.vertex.x, -translationCorrection.vertex.y).magnitude(velocityProjection * physicsWorld.timestep));


            
            // this.vel.add(new Vector2D(translationCorrection.vertex.x, translationCorrection.vertex.y).magnitude(-(this.vel.magnitude() * (1 + this.elasticity)) * physicsWorld.timestep));
            // this.vel.add(new Vector2D(this.vel.x, this.vel.y).magnitude(-(this.vel.magnitude() * (1 + this.elasticity))));

            // if (other.mass != 0) {
            //     other.vel.add(new Vector2D(this.vel.x, this.vel.y));
            // }
            this.vel.y = 0;
            

            // ARCHIVED!
            // let side = new Vector2D(-translationCorrection.vector.y, translationCorrection.vector.x);
            // let velocityShift = side.interiorAngle(this.vel);
            // let velocityAngle = new Vector2D(1, 0).interiorAngle(side);
            // let newVel = vector2DfromAngle(velocityAngle - velocityShift).magnitude(this.vel.magnitude() * this.elasticity);
            // this.vel = newVel;
            

            //  AngularMotion change
            // let angularMotionCorrection = this.getAngularMotionCorrection(new Vector2D(-translationCorrection.vector.y, translationCorrection.vector.x).normalize(), translationCorrection.index)
            


            // this.angularVel = (angularProjection * (translationCorrection.vertex.magnitude()) / this.mass)
            // this.angularMotionUpdate(angularProjection, translationCorrection.vertex);
            this.hardPositionUpdate(translationCorrection.vector); // ATTENTION: may cause problems if no vector is returned

        }
    } else {

    }
}

Collider.prototype.getAngularVelocityVectorOfVertex = function(vertex) {
    let omega = this.angularVel;
    let magnitude = omega * vertex.magnitude();
    if (magnitude == 0) {magnitude += 0.000001}
    return new Vector2D(vertex.y, -vertex.x).magnitude(magnitude);
}


Collider.prototype.applyCentralForce = function(force) {
    this.vel.add(force.mult(new Vector2D(this.physicsWorld.timestep / this.mass, this.physicsWorld.timestep / this.mass)));
}

Collider.prototype.getOwnChunks = function() {
    return new Vector2D(Math.floor(this.pos.x / this.physicsWorld.chunkSize), Math.floor(this.pos.y / this.physicsWorld.chunkSize));
}

Collider.prototype.returnSelf = function() {
    return {
        id: this.id,
        pos: this.pos,
        vertexBuilder: this.vertexBuilder,
        angle: this.angle,

        vertecies: this.vertecies,
        boundingBox: this.boundingBox,

        mass: this.mass,
        elasticity: this.elasticity,
        staticFrition: this.staticFrition,

        sleep: this.sleep,
        isActive: this.isActive,
        type: this.type,

        color: this.color
    }
}

Collider.prototype.getUpdate = function() {
    return {
        id: this.id,
        pos: this.pos,
        angle: this.angle
    }
}

module.exports = Collider;