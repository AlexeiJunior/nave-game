var send = false;

function update() {
	game.scale.refresh();
	if(!ready) return;
	
	if(player.alive){
		moveNave();
		rotationNave();
		tiroNave();
		socketIoServer.emit('position', myId, player.nave.x, player.nave.y, player.nave.body.angle, cr.fireKey.isDown, true);
	}
	for (var j in enemies){
		if(enemies[j]){
			updateDamage(j);
		}
	}
	if(send){
		for (var i in obj){
			if(obj[i]){
				socketIoServer.emit('map', i, obj[i].sprite.x, obj[i].sprite.y, obj[i].sprite.body.angle, obj[i].name, obj[i].fr, obj[i].ki, myId);
			}
		}
	}
}