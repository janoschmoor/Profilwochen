class Button {
	constructor(pos) {
		this.isDown = false;
		this.locked = false;
		
		this.rectWidth = window.innerWidth / 5;
		this.rectHeight = window.innerHeight / 3;
		this.pos = new Vector2D(window.innerWidth - this.rectWidth / 2 - 50, window.innerHeight - this.rectHeight / 2 - 50);
		this.rect = two.makeRoundedRectangle(this.pos.x, this.pos.y, this.rectWidth, this.rectHeight, 10);
		this.rect.noStroke();
		this.rect.fill = "rgba(128, 128, 128, 0.5)";

		this.text = two.makeText("");
		this.text.translation.set(200, 40);
	}

	isTouching(touch) {
        let x = touch.pageX;
		let y = touch.pageY;
        if (x > this.pos.x - this.rectWidth / 2 && x < this.pos.x + this.rectWidth / 2 && y > this.pos.y - this.rectHeight / 2 && y < this.pos.y + this.rectHeight / 2) {
			return true;
		} else {
			return false;
		}
    }

    onTouchStart(touch) {
		if (this.locked == false) {
			this.rect.fill = "rgba(64, 64, 64, 0.5)";
			this.locked = touch.identifier;
			this.isDown = true;
			input.shoot = true;
			socket.emit("clientUpdate", input);
		}
	}
	
    onAnyTouchEnd(touch) {
		if (this.locked == touch.identifier) {
			this.rect.fill = "rgba(128, 128, 128, 0.5)";
            this.locked = false;
            input.shoot = false;
			socket.emit("clientUpdate", input);
		}
	}
	
	onAnyTouchMove() {

	}
}