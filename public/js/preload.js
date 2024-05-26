function preload() {
	game.load.audio('boden', ['./assets/audio/boden.mp3','./assets/audio/boden.ogg']);
	game.load.audio('bullet', ['./assets/audio/bullet.mp3','./assets/audio/bullet.ogg']);
	game.load.image('background','assets/map.png');
	game.load.physics('physicsData','assets/nave.json');
    game.load.image('player','assets/nave.png');
	game.load.image('bullet', 'assets/bullet.png');
	game.load.image('moon', 'assets/moon.png');
	game.load.image('fire', 'assets/fire.png');
}