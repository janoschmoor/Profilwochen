const Vector2D = require("../../vector2d");
const Rectangle = require("./collisionshapes/rectangle");
const Entity = require("./entity")

class PlayerCollider extends Entity {
    constructor(physicsWorld, id, color, pos, angle = 0, reference) {
        super(physicsWorld, id, color, pos, new Rectangle(0.8, 0.8), angle);
        
        this.isActive = true;

        this.drag = new Vector2D(0.9, 0.98);

        this.reference = reference;
        
        var letters = '0123456789ABCDEF';
        this.color = '0x';
        for (var i = 0; i < 6; i++) {
            this.color += letters[Math.floor(Math.random() * 16)];
        } 
        
        this.type = this.constructor.name;
    }
}

PlayerCollider.prototype.collisionDetected = function() {
    
}

module.exports = PlayerCollider;