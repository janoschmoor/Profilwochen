class PlayerCollider extends Entity {
    constructor(playerCollider) {
        super(playerCollider);
        
		// this.id = playerCollider.id;

        this.isActive = true;

        this.drag = new Vector2D(0.9, 0.98);
        
        this.type = this.constructor.name;

		this.mass = playerCollider.mass;
    }
}