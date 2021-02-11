class MobileControls {
    constructor() {
        // this.screenSize = new Vector2D(windowWidth, windowHeight);
        if (windowWidth > windowHeight) {
            this.units = [new Joystick(0, windowHeight*0.25*1.8, windowHeight*0.75*0.87, windowHeight/2.3, windowHeight/2.3), new SlideButton(1)];
        } else {
            this.units = [new Joystick(0, windowWidth*0.25*1.8, windowWidth*0.75*0.87, windowWidth/2.3, windowWidth/2.3), new SlideButton(1)];

        }
        this.activeTouches = [];
    }

    getTouches() {
        
        //          Register new touches
        for (let i = 0; i < touches.length; i++) {
            let index = this.activeTouches.findIndex(touch => touch.id === touches[i].id);
            if (index == -1) {
                this.newTouch(touches[i]);
            }
        }
        // Delete old touches
        for (let i = this.activeTouches.length-1; i >= 0; i--) {
            if (touches.findIndex(touch => touch.id === this.activeTouches[i].id) == -1) {
                this.activeTouches.splice(i,1);
            }
        }

        for (let i = 0; i < this.activeTouches.length; i++) {
            if (this.activeTouches[i].hasOwnProperty('lockedTo')) {
                this.units[this.activeTouches[i].lockedTo].update(i);
                // let index = this.units.findIndex(unit => unit.index === this.activeTouches[i].index);
                // if (index != -1) {
                    
                // }
            }
            
        }
    }
    newTouch(touch) {
        
        this.activeTouches.push(touch);
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i].type == "joystick" && this.units[i].isInside(touch) == true) {
                this.units[i].lockTouch(mobileControlls.activeTouches.length-1);
                
            }
        }
    }

}



class Clickable {
    constructor() {

    }
}
Clickable.prototype.isInside = function(touch) {
    
    let x = this.pos.x - this.size.x/2;
    let y = this.pos.y - this.size.y/2;
    
    if (touch.x > x && touch.x < x + this.size.x && touch.y > y && touch.y < y + this.size.y) {
        return true;
    }
    return false
}


class Joystick extends Clickable{
    constructor(index, posx, posy, sizex, sizey) {
        super();
        this.index = index;
        this.pos = new Vector2D(posx, posy);
        this.size = new Vector2D(sizex, sizey);
        
        this.type = "joystick";
        this.joystick = new Vector2D(0,0);
    }
    render() {
        fill(255, 255, 255, 0)
        ellipse(this.pos.x, this.pos.y, this.size.x, this.size.y);
        fill(255, 255, 255, 170)
        ellipse(this.pos.x + this.joystick.x, this.pos.y + this.joystick.y, this.size.x/3.5, this.size.y/3.5);

    }
    update(i) {
        let index = touches.findIndex(touch => touch.id === mobileControlls.activeTouches[i].id);
        this.joystick.x = touches[index].x - this.pos.x;
        this.joystick.y = touches[index].y - this.pos.y;
        if (this.joystick.magnitude() > this.size.x/2) {
            this.joystick.magnitude(this.size.x/2);
        }
        let controlls = new Vector2D(this.joystick.x, this.joystick.y);
        socket.emit('clientInput',{joystick: controlls.magnitude(controlls.magnitude() / (this.size.x/2))});

    }
    lockTouch(i) {
        mobileControlls.activeTouches[i].lockedTo = this.index;
    }

}




class SlideButton extends Clickable{
    constructor(index) {
        super();
        this.index = index;
        this.pos = new Vector2D(0, 0);
        this.size = new Vector2D(0, 0);

        this.type = "slideButton";
    }
    render() {

    }
}





