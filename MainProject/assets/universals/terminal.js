class Terminal {
    constructor() {}
    log(data) {
      console.log("[Server @" + server.timeManager.ticks + "]: " + data);
    }
    warn(data) {
      console.log("[Warning @" + server.timeManager.ticks + "]: " + data);
    }
    critical(data) {
      console.log("[CRITICAL @" + server.timeManager.ticks + "]: " + data);
      server.timeManager.criticalCases++;
    }
    debug(data) {
      console.log("[Debug @" + server.timeManager.ticks + "]: " + data);
    }
    break() {
      console.log(" ")
    }
    // err(data) {
    //   console.error(data)
    // }
}
module.exports = Terminal;