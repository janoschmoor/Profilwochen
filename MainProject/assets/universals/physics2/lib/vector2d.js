class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

Vector2D.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype._add = function(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
}
Vector2D.prototype.mult = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype._mult = function(other) {
    return new Vector2D(this.x * other.x, this.y * other.y);
}
Vector2D.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype._sub = function(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
}
Vector2D.prototype.div = function(other) {
    this.x /= other.x;
    this.y /= other.y;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype.normalize = function() {
    let scale = Math.sqrt(this.x**2 + this.y**2);
    this.x = this.x / scale;
    this.y = this.y / scale;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype._normalize = function() {
    let scale = Math.sqrt(this.x**2 + this.y**2);
    let x = this.x / scale;
    let y = this.y / scale;
    return new Vector2D(x, y);
}
Vector2D.prototype.magnitude = function(factor = false) {
    if (factor == false) {return Math.sqrt(this.x**2 + this.y**2);}
    this.normalize();
    this.x *= factor;
    this.y *= factor;
    return new Vector2D(this.x, this.y);
}
Vector2D.prototype._magnitude = function(factor = false) {
    if (factor == false) {return Math.sqrt(this.x**2 + this.y**2);}
    return new Vector2D(this.x, this.y).magnitude(factor);
}
Vector2D.prototype.scalarProduct = function(other) {
    return ((this.x * other.x) + (this.y * other.y));
}
Vector2D.prototype.interiorAngle = function(other = new Vector2D(1, 0)) {
    let zeroVector = new Vector2D(1, 0);
    let a1 = Math.acos((this.scalarProduct(zeroVector)) / this.crossProduct(zeroVector));
    if (this.y < 0) {a1 = Math.PI - a1 + Math.PI;}
    let a2 = Math.acos((other.scalarProduct(zeroVector)) / other.crossProduct(zeroVector));
    if (other.y < 0) {a2 = Math.PI - a2 + Math.PI;}
    return a2 - a1;
}
Vector2D.prototype.simpleInteriorAngle = function(other) {
    return Math.acos((this.scalarProduct(other)) / this.crossProduct(other));
}
Vector2D.prototype.intersects = function(pos1, pos2, dir2) {
    var det, gamma, lambda;
    det = (this.x - pos1.x) * (dir2.y - pos2.y) - (dir2.x - pos2.x) * (this.y - pos1.y);
    if (det === 0) {
        console.log("maybe relevant")
        return false;
      } else {
        lambda = ((dir2.y - pos2.y) * (dir2.x - pos1.x) + (pos2.x - dir2.x) * (dir2.y - pos1.y)) / det;
        gamma = ((pos1.y - this.y) * (dir2.x - pos1.x) + (this.x - pos1.x) * (dir2.y - pos1.y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      }
}
Vector2D.prototype.crossProduct = function(other) {
    return Math.abs(this.magnitude() * other.magnitude());
}
Vector2D.prototype.isInside = function(other) {
    if ((this.x > 0 && other.x > 0 && this.y > 0 && other.y > 0) || 
        (this.x < 0 && other.x < 0 && this.y < 0 && other.y < 0) ||
        (this.x < 0 && other.x < 0 && this.y > 0 && other.y > 0) || 
        (this.x > 0 && other.x > 0 && this.y < 0 && other.y < 0)
    ) {
        if (Math.abs(other.x) > Math.abs(this.x) && Math.abs(other.y) > Math.abs(this.y)) {
            return true;
        }
    }
    return false;
}

  
function fromAngle(a) {
    let angle = a % (2*Math.PI);
    if (angle < 0) {
        angle += 2*Math.PI;
    }
    if (angle >= 0 && angle < Math.PI/2) {
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
    } else if (angle >= Math.PI/2 && angle < Math.PI) {
        angle -= Math.PI/2;
        this.x = -Math.sin(angle);
        this.y = Math.cos(angle);
    } else if (angle >= Math.PI && angle < Math.PI*1.5) {
        angle -= Math.PI;
        this.x = -Math.cos(angle);
        this.y = -Math.sin(angle);
    } else if (angle >= Math.PI*1.5 && angle < Math.PI*2) {
        angle -= Math.PI*1.5;
        this.x = Math.sin(angle);
        this.y = -Math.cos(angle);
    }
    return new Vector2D(this.x, this.y);
}
//   function interiorAngle(v1x, v1y, v2x, v2y) {
//     let v1 = new Vector2D(v1x, v1y);
//     let v2 = new Vector2D(v2x. v2y);
//     return Math.acos((v1.scalarProduct(v2)) / (v1.magnitude() * v2.magnitude()));
//   }

module.exports = Vector2D;
module.exports.fromAngle = fromAngle;
