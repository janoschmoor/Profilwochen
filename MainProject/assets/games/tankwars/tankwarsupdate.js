class TankWarsUpdate {
    constructor() {
        this.playerUpdates = [];
        this.projectileUpdates = [];
        this.specials = [];
	}
	
    addPlayerUpdate(playerUpdate) {
        this.playerUpdates.push(playerUpdate);
    }

    addProjectileUpdate(projectileUpdate) {
        this.projectileUpdates.push(projectileUpdate);
    }
}

module.exports = TankWarsUpdate;