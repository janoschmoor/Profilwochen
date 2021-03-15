class Entity extends Collider {
    constructor(entity) {
        super(entity);
        this.vel = new Vector2D(entity.vel.x, entity.vel.y);
        this.acc = new Vector2D(0, 0);
        this.angularVel = entity.angularVel;
        this.angularAcc = 0;

        this.type = this.constructor.name;
    }
}

Entity.prototype.addCentralForce = function() {

}

