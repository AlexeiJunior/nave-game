var game = new Phaser.Game("100%","100%", Phaser.CANVAS, 'phaserGame', { preload: preloadGame, create: createGame, update: updateGame, render: renderGame });
var ready = false;

function preloadGame() {
    game.load.spritesheet('button', 'assets/button.png', 193, 71);
	preload();
}

var button;
function createGame() {
	game.stage.backgroundColor = '#182d3b';
    button = game.add.button(game.world.centerX-100, game.world.centerY, 'button', actionOnClick, this, 2, 1, 0);
}
function updateGame(){	
	update();
}
function renderGame(){	
	render();
}
function actionOnClick () {	button.kill(); socketIoClientSetup();}