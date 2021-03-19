Array.prototype.syncNew = function(obj, type) {
	if (type == "player") {
		this.push(new Player(obj));

		let el = document.getElementById("leaderboard");
		let p = document.createElement("p");
		// let p = document.createElement("<p id=" + data.id + " class=\"playername\">" + data.name + ": + 0</p>");
		
		p.classList.add("playername");
		p.setAttribute("id", obj.id)
		p.innerHTML = obj.name + ": 0";
		el.appendChild(p);
		console.log(el);
	} else if (type == "projectile") {
		this.push(new Projectile(obj));
	}
}

Array.prototype.syncDelete = function(id, type) {
	if (type == "player") {
        let index = this.findIndex(player => player.id === id);
        if (index != -1) {
			this.splice(index, 1);
			
			let parentNode = document.getElementById("leaderboard")
			let el = document.getElementById(id);
			parentNode.removeChild(el);
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