class TimeManager {
    constructor() {
        this.ticks = 0;
        this.preferedTimeOut = 16;
        this.timeOfLastTickStart = Date.now() - this.preferedTimeOut;
        this.timeOfCurrentTickStart = undefined;
        this.timeOfCurrentTickEnd = undefined;
        this.actualTimeOut = undefined;
        this.actualMainLoopTime = undefined;
        this.newTimeOut = undefined;

        this.timeOfLastIOUpdate = Date.now();
        this.preferedIOTimeOut = 40;
    }

    main() {
        // Before MainLoop
        this.ticks++;
        this.timeOfCurrentTickStart = Date.now();
        this.actualTimeOut = this.timeOfCurrentTickStart - this.timeOfLastTickStart;
        this.timeOfLastTickStart = Date.now();
        server.physicsTimeStep = this.actualTimeOut;

        // execute MainLoop and IO loop
        server.mainPhysicsLoop();
        let now = Date.now();
        if (this.preferedIOTimeOut < now - this.timeOfLastIOUpdate) {
            server.mainIO();
            this.timeOfLastIOUpdate = Date.now();
        }

        // After MainLoop
        this.timeOfCurrentTickEnd = Date.now();
        this.actualMainLoopTime = this.timeOfCurrentTickEnd - this.timeOfCurrentTickStart;
        this.newTimeOut =  this.preferedTimeOut  -  ((this.actualTimeOut - this.preferedTimeOut) + (this.actualMainLoopTime));
        // prevent divergence
        if (this.newTimeOut >= this.preferedTimeOut) {this.newTimeOut-=2;}
        else if (this.newTimeOut < this.preferedTimeOut) {this.newTimeOut+=1;}
        if (this.newTimeOut < 0) {this.newTimeOut = 0; terminal.log("critical")}

        // console.log(this.actualMainLoopTime);
        setTimeout(() => { server.timeManager.main() }, this.newTimeOut);   
    }
}

module.exports = TimeManager;