var Cursor = function (game){
	this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.physicKey = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
	this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}