
//---------------------------------------------------------------//
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                   General IO Server Engine                    //
//                                                               //
//---------------------------------------------------------------//





let ip = '192.168.129.241';
let port = 3000;

//      Listen for Clients on specific IP and Port (defined at top)
var express = require('express');
var app = express();
var server = app.listen(port, ip);
app.use(express.static('public'));
var io = require('socket.io')(server);



//---------------------------------------------------------------//
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                                                               //
//                               IO                              //
//                                                               //
//---------------------------------------------------------------//



//      Client input handling
io.sockets.on('connection',

  function(socket) {

    socket.on('connect', function() {
      console.log(socket.id + " connected");
    });
    socket.on('msg',
      function(data) {
        io.emit('appendHistory', data);
        // console.log(data);
      });

    socket.on('disconnect', function() {
        console.log(socket.id + " disconnected");
    });
  }
);
console.log("listening @ IP: "+ip+":"+port);


