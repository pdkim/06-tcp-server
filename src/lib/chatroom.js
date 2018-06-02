'use strict';


const EventEmitter = require('events');
const net = require('net');

const uuid = require('uuid/v4');

const port = process.env.PORT || 3001;
const server = net.createServer();
const eventEmitter = new EventEmitter();
const clientPool = {};


let User = function(socket) {
  let id = uuid();
  this.id = id;
  this.nickname = `User-${id}`;
  this.socket = socket;
};



server.on('connection', (socket) => {
  const user = new User(socket);
  clientPool[user.id] = user;
  socket.on('data', (buffer) => dispatchAction(user.id, buffer));
  console.log('ok!!', user.id);
});


let parse = (buffer) => {
  let text = buffer.toString().trim();
  if(!text.startsWith('@') ) {return null;}  
  let [command, payload] = text.split(/\s+(.*)/);
  let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command, payload, target, message};
};


let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && eventEmitter.emit(entry.command, entry, userId);
};

//message all
eventEmitter.on('@all', (data, userId) => {
  for(let connection in clientPool) {
    let user = clientPool[connection];
    user.socket.write(`<${clientPool[userId].nickname}>: ${data.payload}\n`);
  }
});

//change nickname
eventEmitter.on('@nickname', (data, userId) => {
  clientPool[userId].nickname = data.target;
});

//direct message
eventEmitter.on(`@dm`, (data, userId) => {
  data.target = userId;
  data.message = data;
  clientPool[data.target].socket.write(data.message);
});

//list all users
eventEmitter.on('@list', (data, userId) => {
  let party = [];
  for(let connection in clientPool) {
    data.target = clientPool[connection];
    party.push(data.target);
  }
  userId.socket.write(party);
});

//exit chatroom
eventEmitter.on('@quit', (data, userId) => {
  let notify = `${userId} has left the room.`;
  clientPool.socket.write(notify);
});

server.listen(port, () => {
  console.log(`Chatroom at server: ${port}`);
});