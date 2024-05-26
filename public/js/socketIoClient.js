var socketIoServer;
var socketIoClientSetup = function() {
    socketIoServer = io('http://localhost:8080/');
	
    socketIoServer.on('connect_error', function (e) {
		console.log('connect_error', e);
		game.add.text(32, 32, 'Cannot Connect to the Server', { font: "40px Arial", fill: "#ff0000", align: "center" });
	});

    socketIoServer.on('disconnected', function(id) {
		if (enemies[id]) {
			enemies[id].kill();
			delete enemies[id];
		}
	});
	
	socketIoServer.on('setId', function(id) {
		myId = id;
		create();
		ready = true;
	});
	
	socketIoServer.on('move', function(id,x, y, rotation, f,fcs) {
		socketIoServer.emit('setPing', myId, enemies[myId].ping);

		if (id == myId){ 
			now = new Date();
            socketIoServer.emit('ping', id, now.getTime());
			/*enemies[id].life.position.x = x-20;
			enemies[id].life.position.y = y-100;*/
		}
		if(id != myId){
			if(!enemies[id]) createEnemy(id);
			enemies[id].nave.body.x = x;
			enemies[id].nave.body.y = y;
			enemies[id].nave.body.angle = rotation;
			enemies[id].nave.angle = rotation;
			enemies[id].nave.body.setZeroVelocity();
			enemies[id].life.position.x = x-20;
			enemies[id].life.position.y = y-100;
			
			enemies[id].nave.body.kinematic = fcs;
			
			if(f){
				var velocity;
				if(enemies[id].nave.body.velocity.x == 0 && enemies[id].nave.body.velocity.y == 0){
					velocity = 600;
				}else{
					velocity = 1200;
				}
				fire(x, y, rotation, 100, velocity, id);
			}
		}
	});

	socketIoServer.on('killResp', function(id) {
		if(enemies[id]){
			enemies[id].kill();
			if(id == myId) respawn = true;
			game.time.events.add(Phaser.Timer.SECOND *10, revive, this, id);
		}
	});
	
	socketIoServer.on('map', function(id,x,y,rotation,name,fr, ki) {
		if(!obj[id]) createObj(x, y, name, id, fr, ki);
		obj[id].sprite.body.x = x;
		obj[id].sprite.body.y = y;
		obj[id].sprite.body.angle = rotation;
		obj[id].sprite.angle = rotation;
		obj[id].sprite.body.setZeroVelocity();
	});
	
	socketIoServer.on('changeSender', function(s) {
		send = s;
	});
	
    socketIoServer.on('pong', function (id, pong) {
		now = new Date();   
		enemies[id].ping = now.getTime() - pong;
	});
}