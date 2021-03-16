class Entity extends Collider {
    constructor(entity) {
        super(entity);

        this.type = this.constructor.name;
    }
}

Entity.prototype.addCentralForce = function() {

}

