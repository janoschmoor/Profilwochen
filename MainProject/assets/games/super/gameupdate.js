class GameUpdate {
    constructor() {
        this.playerUpdates = [];
	}
	
    addPlayerUpdate(playerUpdate) {
        this.playerUpdates.push(playerUpdate);
    }
}

module.exports = GameUpdate;