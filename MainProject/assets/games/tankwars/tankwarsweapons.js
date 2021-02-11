const Vector2D = require("../../universals/vector2d.js");
const TankWarsProjectile = require("./tankwarsprojectile.js");

class TankWarsWeapon {
    constructor(tier) {
        this.maxCooldown = 80 - 70 * (tier / (tier + 1));
        this.cooldown = 0;
        this.maxAmmo = 2 + 2 * tier;
        this.currentAmmo = this.maxAmmo;
        this.maxReloadTime = 200;
        this.reloadTime = 200;
        this.projectileSpeed = 100 + 110 * (tier / (tier + 1));
        this.nextWeapon = "Shotgun";

        this.name = this.constructor.name;
    }

    shoot(player) {
        if (this.currentAmmo > 0 && this.cooldown <= 0) {
            this.cooldown = this.maxCooldown;
            this.currentAmmo -= 1;
            player.game.projectiles.push(new TankWarsProjectile(player.pos, this.projectileSpeed, player.angle, 5, 200, player.id, player.team, player.currentCell, player.game.id));
            server.io.to(player.game.id).emit('newProjectile', player.game.projectiles[player.game.projectiles.length - 1]);
            player.game.nextUpdate.specials.push({type: "shootParticle", pos: player.pos, dir: Vector2D.fromAngle(player.angle)})
        }
    }
}

class Shotgun extends TankWarsWeapon{
    constructor(tier) {
        super();
        this.maxCooldown = 30 - 20 * (tier / (tier + 1));
        this.maxAmmo = 4 + tier;
        this.currentAmmo = this.maxAmmo;
        this.maxReloadTime = 200;
        this.reloadTime = 200;
        this.projectileSpeed = 100 + 200 * (tier / (tier + 1));
        this.nextWeapon = "Machinegun";

        this.name = this.constructor.name;
    }

    shoot(player) {
        if (this.currentAmmo > 0 && this.cooldown <= 0) {
            this.cooldown = this.maxCooldown;
            this.currentAmmo -= 1;
            let spread = 0.6;
            for (let i = 0; i < 4; i++) {
                player.game.projectiles.push(new TankWarsProjectile(player.pos, this.projectileSpeed, player.angle + Math.random() * spread - 0.5 * spread, 2, 35, player.id, player.team, player.currentCell, player.game.id));
                server.io.to(player.game.id).emit('newProjectile', player.game.projectiles[player.game.projectiles.length - 1]);
            }
            player.game.nextUpdate.specials.push({type: "shootParticle", pos: player.pos, dir: Vector2D.fromAngle(player.angle)})

        }
    }
}

class Machinegun extends TankWarsWeapon {
    constructor(tier){
        super();
        this.maxCooldown = 10 - 7 * (tier / (tier + 1));
        this.maxAmmo = 30 + 20 * tier;
        this.currentAmmo = this.maxAmmo;
        this.maxReloadTime = 30;
        this.reloadTime = 30;
        this.projectileSpeed = 100 + 200 * (tier / (tier + 1));
        this.nextWeapon = "SpecialWeapon";

        this.name = this.constructor.name;
    }

    shoot(player) {
        if (this.currentAmmo > 0 && this.cooldown <= 0) {
            this.cooldown = this.maxCooldown;
            this.currentAmmo -= 1;
            player.game.projectiles.push(new TankWarsProjectile(player.pos, this.projectileSpeed, player.angle, 1, 200, player.id, player.team, player.currentCell, player.game.id));
            server.io.to(player.game.id).emit('newProjectile', player.game.projectiles[player.game.projectiles.length - 1]);
            player.game.nextUpdate.specials.push({type: "shootParticle", pos: player.pos, dir: Vector2D.fromAngle(player.angle)})

        }
    }
}
class SpecialWeapon extends TankWarsWeapon {
    constructor(tier) {
        super();
        if (tier == 1) { // slowdown and shoot prevention
            this.maxCooldown = 50;
            this.cooldown = 0;
            this.maxAmmo = 2;
            this.currentAmmo = this.maxAmmo;
            this.maxReloadTime = 130;
            this.reloadTime = this.maxReloadTime;
            this.projectileSpeed = 250;
            this.type = "slowdown";
        } else if (tier == 2) { // teleport
            this.maxCooldown = 20;
            this.cooldown = 0;
            this.maxAmmo = 2;
            this.currentAmmo = this.maxAmmo;
            this.maxReloadTime = 200;
            this.reloadTime = 200;
            this.projectileSpeed = 200;
            this.type = "teleport";
        } else if (tier == 3) { // suicide bomber and wallbreaker
            this.maxCooldown = null;
            this.cooldown = null;
            this.projectileSpeed = null;
            
            this.maxAmmo = 1;
            this.currentAmmo = this.maxAmmo;
            this.maxReloadTime = 300;
            this.reloadTime = 300;
            this.type = "bombe";
        }

        this.nextWeapon = "TankWarsWeapon";
        this.name = this.constructor.name;
    }

    shoot(player) {
        if (player.tier == 1) { // slowdown and shoot prevention
            if (this.currentAmmo > 0 && this.cooldown <= 0) {
                this.cooldown = this.maxCooldown;
                this.currentAmmo -= 1;
                player.game.projectiles.push(new TankWarsProjectile(player.pos, this.projectileSpeed, player.angle, 2, 200, player.id, player.team, player.currentCell, player.game.id, "slowdown"));
                server.io.to(player.game.id).emit('newProjectile', player.game.projectiles[player.game.projectiles.length - 1]);
                player.game.nextUpdate.specials.push({type: "shootParticle", pos: player.pos, dir: Vector2D.fromAngle(player.angle)})
            }
        } else if (player.tier == 2) { // teleport
            if (this.currentAmmo > 0 && this.cooldown <= 0) {
                this.cooldown = this.maxCooldown;
                this.currentAmmo -= 1;
                player.game.projectiles.push(new TankWarsProjectile(player.pos, this.projectileSpeed, player.angle, 3, 200, player.id, player.team, player.currentCell, player.game.id, "teleport"));
                server.io.to(player.game.id).emit('newProjectile', player.game.projectiles[player.game.projectiles.length - 1]);
                player.game.nextUpdate.specials.push({type: "shootParticle", pos: player.pos, dir: Vector2D.fromAngle(player.angle)})
            }
        } else if (player.tier == 3) { // suicide bomber and wallbreaker
            let _explosionRadius = 25;
            player.game.nextUpdate.specials.push({type: "suicideBombExplosion", pos: player.pos, explosionRadius: _explosionRadius});
            for (let i = 0; i < player.game.players.length; i++) {
                if (player.game.players[i] != player) {
                    let dist = Math.sqrt(Math.abs(player.pos.x - player.game.players[i].pos.x) ** 2 + Math.abs(player.pos.y - player.game.players[i].pos.y) ** 2)
                    if (dist < _explosionRadius + 24) {
                        player.game.players[i].health -= 200;
                        player.game.state = "done";
                        server.io.to(player.game.id).emit("gameOver", player.id);
                        let gameIndex = server.games.findIndex(game => game.id === player.game.id);
                        server.games.splice(gameIndex , 1);
                    }
                    player.health = 0;
                }
            }
        }
    }
}

module.exports = [TankWarsWeapon, Shotgun, Machinegun, SpecialWeapon];
