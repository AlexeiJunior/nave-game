var myId;
var enemies;
var bullets;
var fireRate = 200;
var bulletAT = 0.5;
var respawn = false;
var ready = false;
var bullet;

var Enemy = function (x, y, id, game, enable) {
    var x = x;
    var y = y;
	this.ping = 0;
    this.game = game;
	this.alive = true;
	this.nextFire = 0;
    this.nave = game.add.sprite(x, y, 'player');
    this.nave.name = id.toString();
	//game.physics.p2.enable(this.nave, enable);
	game.physics.p2.enable(this.nave);
	this.nave.body.clearShapes();
	this.nave.body.loadPolygon('physicsData', 'player');
	if(id == myId) game.camera.follow(this.nave);
	this.nave.body.fixedRotation = true;
	socketIoServer.emit('getHealth', id, (health) => {
		this.health = health;
	});
	this.life = game.add.text(x, y, this.health, { font: "24px Arial", fill: "#ff0000", align: "center" });
	if(id == myId) this.life.kill();
	this.nave.body.name = id.toString(); //registrar o nome do corpo;
	this.nave.body.kinematic = !enable; 
};

Enemy.prototype.kill = function() {
	this.alive = false;
	this.nave.kill();
	this.life.kill();
}

function revive(id) {
	respawn = false;
	enemies[id].nave.reset(100,100);
	if(id != myId) enemies[id].life.reset(100,100);
	enemies[id].alive = true;
}

function moveNave() {
    player.nave.body.setZeroVelocity();
	if ((cr.upKey.isDown) && (cr.rightKey.isDown) && (cr.leftKey.isDown))
	{
		player.nave.body.moveUp(600);
	}
	else if((cr.downKey.isDown) && (cr.rightKey.isDown) && (cr.leftKey.isDown))
	{
		player.nave.body.moveDown(600);
	}
	else if((cr.downKey.isDown) && (cr.upKey.isDown) || (cr.rightKey.isDown) && (cr.leftKey.isDown))
	{
		
	}
	else{
		if(cr.upKey.isDown) player.nave.body.moveUp(600);
		if(cr.downKey.isDown) player.nave.body.moveDown(600);
		if(cr.leftKey.isDown) player.nave.body.moveLeft(600);
		if(cr.rightKey.isDown) player.nave.body.moveRight(600);
	}
}

function rotationNave() {
	if ((cr.downKey.isDown) && (cr.rightKey.isDown) && (cr.leftKey.isDown))
    {
		player.nave.body.angle = 90;
		player.nave.angle = 90;
    }
	else if ((cr.upKey.isDown) && (cr.rightKey.isDown) && (cr.leftKey.isDown))
	{
		player.nave.body.angle = 270;
		player.nave.angle = 270;
	}
	else
	{
		if ((cr.downKey.isDown) && (cr.rightKey.isDown))
		{
			player.nave.body.angle = 45;
			player.nave.angle = 45;
		}
		else if((cr.downKey.isDown) && (cr.leftKey.isDown))
		{
			player.nave.body.angle = 135;
			player.nave.angle = 135;
		}
		else if((cr.upKey.isDown) && (cr.rightKey.isDown))
		{
			player.nave.body.angle = 315;
			player.nave.angle = 315;
		}
		else if((cr.upKey.isDown) && (cr.leftKey.isDown))
		{
			player.nave.body.angle = 225;
			player.nave.angle = 225;
		}
		else
		{
			if (cr.upKey.isDown)
			{
				player.nave.body.angle = 270;
				player.nave.angle = 270;
			}
			else if (cr.downKey.isDown)
			{
				player.nave.body.angle = 90;
				player.nave.angle = 90;
			}

			if (cr.leftKey.isDown)
			{
				player.nave.body.angle = 180;
				player.nave.angle = 180;
			}
			else if (cr.rightKey.isDown)
			{
				player.nave.body.angle = 0;
				player.nave.angle = 0;
			}
		}
	}
}

function tiroNave() {
	if (cr.fireKey.isDown)
    {
		var velocity;
		if(player.nave.body.velocity.x == 0 && player.nave.body.velocity.y == 0){
			velocity = 600;
		}else{
			velocity = 1200;
		}
		fire(player.nave.body.x, player.nave.body.y, player.nave.body.angle, 100, velocity, myId);
    }
}

function createEnemy(id) {
	enemies[id] = new Enemy(0, 0,id, game, false);
}
function playBulletSound() {
	bullet.play();
}

function fire(x, y, rotation, mass, velocity, id) {
    if (game.time.now > enemies[id].nextFire && bullets.countDead() > 0) {
		playBulletSound();
		enemies[id].nextFire = game.time.now + fireRate;
		var bullet = bullets.getFirstExists(false);
		bullet.id = id;
		bullet.body.angle = rotation;
		bullet.angle = rotation;
		bullet.body.mass = mass;
		if(rotation == 0){
			bullet.reset(x+90, y);
			bullet.body.moveRight(velocity);
		}
		else if(rotation == 90){
			bullet.reset(x, y+90);
			bullet.body.moveDown(velocity);
		}
		else if(rotation == -90){
			bullet.reset(x, y-90);
			bullet.body.moveUp(velocity);
		}
		else if(rotation == -180){
			bullet.reset(x-90, y);
			bullet.body.moveLeft(velocity);
		} 
		else if(rotation == -45){
			bullet.reset(x+90, y-90);
			bullet.body.moveUp(velocity);
			bullet.body.moveRight(velocity);
		} 
		else if(rotation == -135){
			bullet.reset(x-90, y-90);
			bullet.body.moveUp(velocity);
			bullet.body.moveLeft(velocity);
		} 
		else if(rotation == 45){
			bullet.reset(x+90, y+90);
			bullet.body.moveDown(velocity);
			bullet.body.moveRight(velocity);
		} 
		else if(rotation == 135){
			bullet.reset(x-90, y+90);
			bullet.body.moveDown(velocity);
			bullet.body.moveLeft(velocity);
		} 
		if(id == myId) bullet.body.onBeginContact.add(blockHit, bullet);
		//destroy bullet at .5s
		game.time.events.add(Phaser.Timer.SECOND * bulletAT, bulletdie, this, bullet);
	}
}

function blockHit (body, bodyB, shapeA, shapeB, equation) {
    if (body) {
		if(enemies[body.name] && this.id != body.name && myId != body.name) {
			socketIoServer.emit('log', "Player:(" + myId + ") hits (" + body.name + ")!!");
			socketIoServer.emit('damage', body.name, 10);
			bulletdie(this);
		}
	} else {
        console.log("wall");
    }
}

function bulletdie(bullet) {
	bullet.kill();
}

function updateDamage(id) {
	if(enemies[id]){
		socketIoServer.emit('getHealth', id, (health) => {
			enemies[id].life.text = health;
		});
	}
}