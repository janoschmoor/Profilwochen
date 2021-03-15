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
			this.splice(index, 1);
        } else {
			// console.log("ERROR: WITH LISTS WHILE SPLICING " + type + " with id " + id + " could not be found");
			// console.log(this);
		}
	} else if (type == "projectile") {
        let index = this.findIndex(projectile => projectile.id === id);
        if (index != -1) {
			this.splice(index, 1);
        } else {
			// console.log("ERROR: WITH LISTS WHILE SPLICING " + type + " with id " + id + " could not be found");
			// console.log(this);
		}
	}
}