class Vector2D {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  Vector2D.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.mult = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return new Vector2D(this.x, this.y);
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
  Vector2D.prototype.magnitude = function(factor = false) {
    if (factor == false) {return Math.sqrt(this.x**2 + this.y**2);}
    this.normalize();
    this.x *= factor;
    this.y *= factor;
    return new Vector2D(this.x, this.y);
  }
  Vector2D.prototype.scalarProduct = function(other) {
    return ((this.x * other.x) + (this.y * other.y));
  }
  Vector2D.prototype.interiorAngle = function(other) {
    return Math.acos((this.scalarProduct(other)) / (this.magnitude() * other.magnitude()));
  }
  
  function vector2DFromAngle(a) {
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