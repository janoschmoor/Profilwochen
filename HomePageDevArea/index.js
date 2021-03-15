let ip = '192.168.129.225';
let port = 3000;

let express = require('express');

let app = express();
app.use(express.static('public'));

let server = app.listen(port, ip);

let io = require('socket.io')(server);

console.log("done")