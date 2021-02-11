class Joystick{
    constructor(pos) {
        this.pos = new Vector2D(window.innerWidth / 8 + 50, window.innerHeight * 3 / 4 - 50);
        this.shape = {
            type: "circle",
            radius: window.innerHeight / 4
        };

        this.bigCircle = two.makeCircle(this.pos.x, this.pos.y, this.shape.radius);
        this.bigCircle.noStroke();
        this.bigCircle.fill = "rgba(128, 128, 128, 0.5)";

        this.innerCircle = two.makeCircle(this.pos.x, this.pos.y, this.shape.radius/3);
        this.innerCircle.noStroke();
        this.innerCircle.fill = "rgba(64, 64, 64, 0.75)";

        this.locked = false;
        this.pointer = new Vector2D(0,0);
    }

    isTouching(touch) {
        let x = touch.pageX - this.pos.x;
        let y = touch.pageY - this.pos.y;
        if (Math.sqrt(x * x + y * y) < this.shape.radius) {
            return true;
        } else {return false;}
    }

    onTouchStart(touch) {
        if (this.locked == false) {
            this.locked = touch.identifier;
            this.pointer = new Vector2D(touch.pageX, touch.pageY).sub(this.pos);

            this.innerCircle.translation.set(this.pos.x + this.pointer.x, this.pos.y + this.pointer.y);
        }
    }

    onAnyTouchMove(touch) {
        if (this.locked === touch.identifier) {
            this.pointer = new Vector2D(touch.pageX, touch.pageY).sub(this.pos);

            if (this.pointer.magnitude() > this.shape.radius) {
                this.pointer.magnitude(this.shape.radius);
            }

            this.innerCircle.translation.set(this.pointer.x + this.pos.x, this.pointer.y + this.pos.y);
        }
    }

    onAnyTouchEnd(touch) {
        if (this.locked === touch.identifier) {
            this.locked = false;
            this.pointer = new Vector2D(0, 0);
            this.innerCircle.translation.set(this.pos.x + this.pointer.x, this.pos.y + this.pointer.y);
        }
    }
}