
class Sensor extends Collider {
    constructor(collider) {
        super(collider);

        this.type = this.constructor.name;
    }
}