
class Sensor extends Collider {
    constructor(collider) {
        super(collider);
        this.noCollide = true;
        this.type = this.constructor.name;
    }
}