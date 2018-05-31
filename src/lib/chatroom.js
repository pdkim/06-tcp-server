'use strict';

//first party modules
const EventEmitter = require('events');
const net = require('net');

//third party modules
//gives user unique id in chatroom
const uuid = require('uuid/v4');

const port = process.env.PORT || 3001;
const server = net.createServer();
const eventEmitter = new EventEmitter();
const socketPool = {};

let User = function(socket) {
  this.name = name;

};

server.on('connection', (socket) => { //in docs....
  const user = new User(socket);

  socketPool[user.id] = user;

  //listening for data
  //when fired, callback will be a buffer
  //function dispatch action will take in user id and buffer
  socket.on('data', (buffer) => dispatchAction(user.id, buffer));
  console.log('ok!!', user.id);

});

let parse = (buffer) => {
  let text = buffer.toString().trim();
  if(!text.startsWith('@') ) {return null;}
  
  //array destructuring
  //when syntax is used
  //
  let [command, payload] = text.split(/\s+(.*)/);
  let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command, payload, target, message};
};

let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  //checking truthy of entry.
  //if truthy (after parsed), then it is "safe" and return values
  //safeguard against null values
  //same as if entry !=== null && etc.
  entry && eventEmitter.emit(entry.command, entry, userId);
};

eventEmitter.on('@all', (data, userId) => {
  //pay attention to this formatting
  //modern way to loop through
  for(let connection in socketPool) {
    let user = socketPool[connection];
    //for all users, find this user and return their nickname and the text body
    user.socket.write(`<${socketPool[userId].nickname}>: ${data.payload}\n`);
  }
});

eventEmitter.on('@nick', (data, userId) => {
  //within the pool, whoever requested change, change to typed entry
  //console log data to figure out which key you need
  socketPool[userId].nickname = data.target;
});