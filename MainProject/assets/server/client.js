class Client {
    constructor(id, game, isMobile) {
        this.id = id;
        this.game = game;
        this.clientInput = {};
        this.isMobile = isMobile;
    }

    getUpdate() {}
    returnSelf() {}
}

module.exports = Client;