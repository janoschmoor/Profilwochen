class Particle {
    constructor(shape={type: "circle", radius: 5}, color="rgba(0.0, 0.0, 0.0, 1.0)", life=30, pos=new Vector2D(0, 0), vel=new Vector2D(1, 1), rotation=0, drag=0.9) {
        this.pos = pos;
        this.vel = vel;
        this.drag = drag;
        this.type = shape.type;
        this.angle = Math.random()* Math.PI;
        this.rotation = rotation;
        this.life = life;
        this.color = color;

        if (shape.type == "circle") {
            this.display = two.makeCircle(this.pos.x * me.scope, this.pos.y * me.scope, shape.radius * me.scope);
            if (shape.stroke == false) {this.display.noStroke();}
            this.display.fill = this.color;
            foreground.add(this.display);
        }
        if (shape.type == "rect") {
            this.display = two.makeRectangle(this.pos.x * me.scope, this.pos.y * me.scope, shape.size.x * me.scope, shape.size.y * me.scope);
            if (shape.stroke == false) {this.display.noStroke();}
            this.display.fill = this.color;
            foreground.add(this.display);
        }
    }
	
    update(xOffset, yOffset) {
        this.life --;
        this.pos.add(this.vel);
        this.vel.x *= this.drag;
        this.vel.y *= this.drag;
        this.rotation *= this.drag;
        this.angle += this.rotation;

        this.display.translation.set(xOffset + this.pos.x * me.scope, yOffset + this.pos.y * me.scope);
        this.display.rotation = this.angle;
    }
}