function render() {
	if(!ready) return;
	
	if(respawn) game.debug.text('RESPAWNING', game.width/2-250, game.height/2, "#990000", "72px Arial", "center");
	if(!respawn) game.debug.text(enemies[myId].life.text, game.width/2-50, 80, "#990000", "72px Arial", "center");
	
	if(cr.physicKey.isDown){
		game.debug.text('Online Players:', 15, 80, "#19de65");
		var j = 120;
		for(var i in enemies){
			if(enemies[i]){
				if(enemies[i].nave.name == myId) game.debug.text(enemies[i].nave.name + ' (YOU)', 20, j, "#ffffff");
				else game.debug.text(enemies[i].nave.name, 20, j, "#19de65");
				j+=20;
			}
		}
		game.debug.text(enemies[myId].ping + 'ms', 2, 14, "#19de65");
		if(send) game.debug.text('00', 15, 400, "#19de65");
		game.debug.text(game.time.fps, game.width-20, 14, "#00ff00");
		//game.debug.cameraInfo(game.camera, 32, 32, "#19de65");
		//game.debug.spriteCoords(enemies[myId].nave, 32, 500, "#19de65");
		//game.debug.spriteInfo(enemies[myId].nave, 500, 500, "#19de65");
		//game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 500, 32, "#19de65");
	}
}