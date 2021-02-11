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

        this.controlls = {w: false, a: false, s: false, d: false, shoot: false};

        this.projectiles = [];
        this.items = [];
    }
    loop() {
        //          Send Input
        if (isOnMobile == false) {
            this.sendInput();
        }

        // determine delta time
        timeStep = (Date.now() - timeOfLastPhysicsEstimation) / 1000;
        timeOfLastPhysicsEstimation = Date.now();


        //          Render World
        push();
        translate(-(thisPlayer.pos.x * thisPlayer.scope - windowWidth/2), -(thisPlayer.pos.y * thisPlayer.scope - windowHeight/2));

        this.render();

        // projectiles
        for (let i = this.projectiles.length-1; i >= 0; i--) {
            if (this.projectiles[i].lifeIsOver()) {
                i--;
                game.projectiles.splice(i, 1);
            } else {
                this.projectiles[i].estimatePhysics();
                this.projectiles[i].render();
            }
        }


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
    render() {
        for (let x = 0; x < this.world.cells.length; x++) {
            for (let y = 0; y < this.world.cells[x].length; y++) {
                if (this.world.cells[x][y].walls.top == true) {
                    line(x * thisPlayer.scope, y * thisPlayer.scope, (x+1) * thisPlayer.scope, y * thisPlayer.scope);
                }
                if (this.world.cells[x][y].walls.right == true) {
                    line((x+1) * thisPlayer.scope, y * thisPlayer.scope, (x+1) * thisPlayer.scope, (y+1) * thisPlayer.scope);
                }
                if (this.world.cells[x][y].walls.bottom == true) {
                    line((x+1) * thisPlayer.scope, (y+1) * thisPlayer.scope, x * thisPlayer.scope, (y+1) * thisPlayer.scope);
                }
                if (this.world.cells[x][y].walls.left == true) {
                    line(x * thisPlayer.scope, (y+1) * thisPlayer.scope, x * thisPlayer.scope, y * thisPlayer.scope);
                }
                
            }
            
        }
    }

    sendInput() {
        let shouldSend = false;

        // for (let i = 0; i < 255; i++) {
        //     if (keyIsDown(i)) {
        //         console.log(i);
        //     }
        // }

        let w = keyIsDown(87); if (keyIsDown(38) == true) {w = true}
        let a = keyIsDown(65); if (keyIsDown(37) == true) {a = true}
        let s = keyIsDown(83); if (keyIsDown(40) == true) {s = true}
        let d = keyIsDown(68); if (keyIsDown(39) == true) {d = true}
        let shoot = keyIsDown(32);
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
        //          Shoot (Spacebar)
        if (shoot == true && this.controlls.shoot == false) {
            this.controlls.shoot = true;
            shouldSend = true;
        } else if (shoot == false && this.controlls.shoot == true) {
            this.controlls.shoot = false;
            shouldSend = true;
        }
        
        if (shouldSend) {
            socket.emit('clientInput', this.controlls);
        }
    }
}