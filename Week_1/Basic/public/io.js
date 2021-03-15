var socket;
var keyVar;

function connect(name) {
    socket = io.connect('192.168.129.241:3000');
    
    listen();

    socket.emit('connect',{});
}

function send_msg(name, msgData) {
    socket.emit('msg', {name: name, msg: msgData})
}

function listen() {

    socket.on('appendHistory',
        function(data) {
            // var node = document.getElementsByClassName('typeField');
            // var node = document.getElementById('chat');
            // var para = document.createElement("P");
            // para.innerText = data.name + ": " + data.msg
            // console.log(para);
            // node.insertBefore(document.createElement("BR"))
            // node.insertBefore(para);

            var parentDiv = document.getElementById('chat');
            var para = document.createElement("P");
            para.innerText = data.name + ": " + data.msg;
            // console.log(para);
            var firstChild = document.getElementById("chat").firstElementChild;
            // console.log(firstChild);
            parentDiv.insertBefore(document.createElement("BR"), firstChild)
            parentDiv.insertBefore(para, firstChild)

            // node.insertBefore(document.createElement("BR"))
            // node.insertBefore(para);
            
        }
    );


}
