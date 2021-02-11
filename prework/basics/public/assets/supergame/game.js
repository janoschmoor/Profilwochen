class Game {
    constructor(serverGame) {
        this.maxAmountOfPlayers = serverGame.maxAmountOfPlayers;
        this.minAmountOfPlayers = serverGame.minAmountOfPlayers;
        this.allowJoiningWithoutPartyCode = serverGame.allowJoiningWithoutPartyCode;
        this.players = []
        for (let index = 0; index < serverGame.players.length; index++) {
            this.players.push(new Player(serverGame.players[index]));
        }
        this.spectators = serverGame.spectators;
        this.type = serverGame.type;
        this.id = serverGame.id;
        this.partyCode = serverGame.partyCode;

        this.world = serverGame.world;

        this.controlls = {w: false, a: false, s: false, d: false};
    }
    loop() {
        //          Send Input
        if (isOnMobile == false) {
            this.sendInput();
        }


        //          Render World
        push()
        translate(-(thisPlayer.pos.x * thisPlayer.scope - windowWidth/2), -(thisPlayer.pos.y * thisPlayer.scope - windowHeight/2))


        //          Estimate and Render all Player pos/rotation
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].estimatePhysics(i);
            this.players[i].render(i);
        }

        pop();
        if (isOnMobile == true) {
            mobileControlls.getTouches();
            for (let i = 0; i < mobileControlls.units.length; i++) {
                mobileControlls.units[i].render();
            }
        }
    }
    sendInput() {
        let shouldSend = false;

        let w = keyIsDown(87); if (keyIsDown(38) == true) {w = true}
        let a = keyIsDown(65); if (keyIsDown(37) == true) {a = true}
        let s = keyIsDown(83); if (keyIsDown(40) == true) {s = true}
        let d = keyIsDown(68); if (keyIsDown(39) == true) {d = true}
        //          W Key
        if (w == true && this.controlls.w == false) {
            this.controlls.w = true;
            shouldSend = true;
        } else if (w == false && this.controlls.w == true) {
            this.controlls.w = false;
            shouldSend = true;
        }
        //          A Key
        if (a == true && this.controlls.a == false) {
            this.controlls.a = true;
            shouldSend = true;
        } else if (a == false && this.controlls.a == true) {
            this.controlls.a = false;
            shouldSend = true;
        }
        //          S Key
        if (s == true && this.controlls.s == false) {
            this.controlls.s = true;
            shouldSend = true;
        } else if (s == false && this.controlls.s == true) {
            this.controlls.s = false;
            shouldSend = true;
        }
        //          D Key
        if (d == true && this.controlls.d == false) {
            this.controlls.d = true;
            shouldSend = true;
        } else if (d == false && this.controlls.d == true) {
            this.controlls.d = false;
            shouldSend = true;
        }
        
        if (shouldSend) {
            socket.emit('clientInput', this.controlls);
        }
    }
}