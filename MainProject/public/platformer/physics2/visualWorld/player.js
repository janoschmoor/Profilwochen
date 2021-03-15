class Player extends Entity {
    constructor(pos, angle = 0) {
        super(pos, new Rectangle(1, 2), angle);
        
        this.isActive = true;

        this.scope = 20;
        
        this.type = this.constructor.name;
    }
}