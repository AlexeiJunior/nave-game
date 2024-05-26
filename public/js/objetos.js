var obj;

var Obj = function (x, y, name, game, enable, fr, ki) {
    var x = x;
    var y = y;
	this.fr = fr;
	this.ki = ki;
    this.game = game;
	this.name = name;
    this.sprite = game.add.sprite(x, y, name);
	//game.physics.p2.enable(this.sprite, enable);
	game.physics.p2.enable(this.sprite);
	this.sprite.body.fixedRotation = fr;
	this.sprite.body.kinematic = ki;
	/*this.sprite.body.clearShapes();
	this.sprite.body.loadPolygon('physicsData', name);*/
	if(name == "moon") this.sprite.body.setCircle(480);
	if(name == "fire") this.sprite.body.setCircle(180);
};

function createObj(x, y, name, id, fr, ki) {
	obj[id] = new Obj(x, y, name, game, true, fr, ki);
}