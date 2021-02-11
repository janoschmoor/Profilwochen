Array.prototype.syncNew = function(obj, type) {
	if (type == "player") {
		this.push(new Player(obj));
	} else if (type == "projectile") {
		this.push(new Projectile(obj));
	}
}

Array.prototype.syncDelete = function(id, type) {
	if (type == "player") {
        let index = this.findIndex(player => player.id === id);
        if (index != -1) {
			two.remove(this[index].rect);
			two.remove(this[index].nameText);
			two.remove(this[index].barrel);
			two.remove(this[index].turret);
			foreground.remove(this[index].rect);
			foreground.remove(this[index].nameText);
			foreground.remove(this[index].barrel);
			foreground.remove(this[index].turret);
			this.splice(index, 1);
        } else {
			// console.log("ERROR: WITH LISTS WHILE SPLICING " + type + " with id " + id + " could not be found");
			// console.log(this);
		}
	} else if (type == "projectile") {
        let index = this.findIndex(projectile => projectile.id === id);
        if (index != -1) {
			two.remove(this[index].circle);
			foreground.remove(this[index].circle);
			this.splice(index, 1);
        } else {
			// console.log("ERROR: WITH LISTS WHILE SPLICING " + type + " with id " + id + " could not be found");
			// console.log(this);
		}
	}
}