class PlatformerUpdate {
    constructor() {
        this.playerUpdates = [];
        this.specials = [];
        this.colliderUpdates = [];
	}
	
    addPlayerUpdate(playerUpdate) {
        this.playerUpdates.push(playerUpdate);
    }

    addColliderUpdate(colliderUpdate) {
        this.colliderUpdates.push(colliderUpdate);
    }
}

module.exports = PlatformerUpdate;