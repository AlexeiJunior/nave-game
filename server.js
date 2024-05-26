const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = 8080
const io = require('socket.io')(server)

const colorBlue = "\x1b[96m"
const colorYellow ='\x1b[93m'
const colorGreen = "\x1b[92m"
const colorRed = "\x1b[91m"
const colorWhite = "\x1B[97m"

var clients = {}
var objects = {}

var objectId = 1
var objects = function (id, x, y, rotation, name, fr, ki) {
	this.id = id
	this.x = x
	this.y = y
	this.rotation = rotation
	this.name = name
	this.fr = fr
	this.ki = ki
}

function logMessage(msg, color) {
	console.log(color+msg+colorWhite)
}

io.on('connection', (socket) => { 
	
    logMessage('New client id= '+socket.id+' ip= '+socket.handshake.address, colorGreen)
    
	var remote = socket 
	clients[socket.id] = {id:socket.id, remote:remote, ping: 0, health:100}

	socket.emit('setId', socket.id)
	socket.on('disconnect', () => onDisconnect(socket))


	socket.on('log', (msg) => log(msg))
	socket.on('ping', (id, ping) => ping(id, ping))
	socket.on('setPing', (id, ping) => setPing(id, ping))
	socket.on('getHealth', (id, callback) => getHealth(id, callback))
	socket.on('position', (id,x,y,rotationation,fire,fcs) => position(socket,id,x,y,rotationation,fire,fcs))
	socket.on('damage', (id, damage) => doDamage(socket, id, damage))
	socket.on('map', (id,x,y,rotationation,name, fr, ki, userId) => map(id,x,y,rotationation,name, fr, ki, userId))
	
	sendObjectsPosition(socket.id)
	changeSender()
})

function onDisconnect(socket) {    
	delete clients[socket.id]
	socket.broadcast.emit('disconnected', socket.id)
	logMessage('Client disconnected '+socket.id, colorRed)
	
	changeSender()
}

function log(msg) {
	logMessage(msg, colorYellow)
}

function ping(id, ping) {
	clients[id].remote.emit('pong', id, ping)
}

function setPing(id, ping) {
	clients[id].ping = ping
}

// //SEND OBJECTS CREATING OBJECTS?????? FOR EACH PLAYER?
function sendObjectsPosition(id) {
	objects[objectId++] = new objects(objectId, 900, 900, 0, "moon", false, false)
	objects[objectId++] = new objects(objectId, 500, 500, 0, "fire", false, false)
	
	for (var object in objects) {
		if (objects[object]) {
			clients[id].remote.emit('map', objects[object].id,objects[object].x,objects[object].y,objects[object].rotation,objects[object].name, objects[object].fr, objects[object].ki)
		}
	}
}

// //CHANGE SEND TRUE
function changeSender() {
	var menorPing = 10000
	var idPlayer
	
	for (var i in clients) {
		if (clients[i]) {
			if (clients[i].ping < menorPing) {
				menorPing = clients[i].ping
				idPlayer = i
			}
		}
	}

	if (clients[idPlayer]) {
		clients[idPlayer].remote.emit('changeSender', true)
	}
}

// // WHATS FIRE AND FCS?
// // SERVER SHOULD ALWAYS SEND PLAYER POSITION PLAYER DOSENT NEED TO REQUEST
// // CHANGE NAME TO sendPosition?
function position(socket, id,x,y,rotationation,fire,fcs) {
	socket.broadcast.emit('move',id,x,y,rotationation,fire,fcs)
}

// //WHATS FR AND KI?
// //PLAYER SHOULD SEND OBJECT POSITIONS?
// //CHANGE TO sendObjectsData?
function map(id,x,y,rotationation,name, fr, ki, userId) {
	for (var client in clients) {
		if (clients[client] && client != userId) {
			
			for (var object in objects) {
				if (objects[object].id == id) {
					objects[object].id = id
					objects[object].x = x
					objects[object].y = y
					objects[object].rotationation = rotationation
					objects[object].name = name
					objects[object].fr = fr
					objects[object].ki = ki
				}
			}
			
			clients[client].remote.emit('map', id,x,y,rotationation,name, fr, ki)
		}
	}
}

function getHealth(id, callback) {
	if (clients[id]) {
		callback(clients[id].health)
	}
}

// //CLIENT DOSENT NEED TO KNOW HOW MUCH THE DAMAGE IS
// //SEND BACK TO CLIENTS IF PLAYER RECIEVE DAMAGE?
// //CHANGE TO doDamage ?
function doDamage(socket, id, damage) {
	if (clients[id]) {
		if (clients[id].health - damage <= 0) {
			clients[id].health = 100
			logMessage("Player:(" + id + ") died", colorWhite)
			socket.broadcast.emit('killResp', id)
		}
		else clients[id].health -= damage
	}
}

app.use(express.static('public/'))

server.listen(port, () => {
	logMessage("Server running on port: "+port, colorBlue)
})
