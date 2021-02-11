class Client {
    constructor(){
        this.name = 'Anonymous';
        this.history = [];
    }

    connect_to_server() {
        connect(this.name);
    }

    send(message) {
        send_msg(this.name, message);
    }
}
let me = new Client();
me.connect_to_server();

function nameConfirmed() {
    console.log("test")
}


window.addEventListener('keydown', function (event) {
	if (event.key === ' ') {
		switchColor();
	} else if (event.key === 'Enter' && document.activeElement === document.getElementById('typefield')) {
        if (document.getElementById('namefield').value == '') {
            me.name = 'anonymous';
        } else {
            me.name = document.getElementById('namefield').value;
        }
        if (document.getElementById('typefield').value != '') {
            me.send(document.getElementById('typefield').value);
        }
		document.getElementById('typefield').value = '';
	}
})
