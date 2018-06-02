'use strict';

/**
 * @type {{}}
 */
let EE = require('events');

let eventEmitter = new EE();

module.exports = eventEmitter;

exports.fire = () => {
  eventEmitter.emit('@all');
};