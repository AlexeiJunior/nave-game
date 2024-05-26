function create() {
	game.add.tileSprite(0, 0, 2560, 1600, 'background');
    game.world.setBounds(0, 0, 2560, 1600);
    game.physics.startSystem(Phaser.Physics.P2JS);
	game.stage.disableVisibilityChange = true;
	player = new Enemy(0, 0,myId, game, true);
	enemies = {};
	obj = {};
	bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.P2JS;
    bullets.createMultiple(100, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
	enemies[myId] = player;
	cr = new Cursor(game);
	music = game.add.audio('boden');
	//music.loopFull();
	//music.volume -= 0.9;
	bullet = game.add.audio('bullet');
	game.time.advancedTiming = true;
}