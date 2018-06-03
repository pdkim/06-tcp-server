'use strict';


const EventEmitter = require('events');
const net = require('net');

const uuid = require('uuid/v4');

const port = process.env.PORT || 3000;
const server = net.createServer();
const eventEmitter = new EventEmitter();
const clientPool = {};


let User = function (socket) {
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
  if (!text.startsWith('@')) { return null; }
  let [command, payload] = text.split(/\s+(.*)/);
  let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
  return { command, payload, target, message };
};


let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && eventEmitter.emit(entry.command, entry, userId);
};

//message all
eventEmitter.on('@all', (data, userId) => {
  for (let connection in clientPool) {
    let user = clientPool[connection];
    user.socket.write(`<${clientPool[userId].nickname}>: ${data.payload}\n`);
  }
});

//change nickname
eventEmitter.on('@nickname', (data, userId) => {
  let newName = data.target;
  clientPool[userId].nickname = newName;
  clientPool[userId].socket.write('' + clientPool[userId].nickname);
});

//direct message
eventEmitter.on(`@dm`, (data, userId) => {
  const targetUser = data.target;
  const message = data.message;
  for (let connection in clientPool) {
    if (clientPool[connection].nickname === targetUser) {
      clientPool[connection].socket.write('' + message);
    }
  }
});

//list all users
eventEmitter.on('@list', (data, userId) => {
  let party = [];
  for (let connection in clientPool) {
    party.push(clientPool[connection].nickname);
  }
  clientPool[userId].socket.write('' + party);
});

//exit chatroom
eventEmitter.on('@quit', (data, userId) => {
  // console.log(clientPool[userId]);
  const getOut = clientPool[userId].nickname;
  const notify = `${getOut} has left the room.`;
  for(let connection in clientPool) {
    clientPool[connection].socket.write('' + notify);
  }
  // server.on('close');
});

server.listen(port, () => {
  console.log(`Chatroom at server: ${port}`);
});