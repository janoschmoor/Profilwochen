const Server = require('./assets/server/server.js');
const Path = require('path');

const Vector2D = require('./assets/universals/vector2d.js');
const Terminal = require('./assets/universals/terminal.js');


global.terminal = new Terminal();
global.server = new Server();
terminal.log("listening @ "+server.ip+":"+server.port);




server.timeManager.main();
