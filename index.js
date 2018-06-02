'use strict';

const server = require('../src/app.js');

const dotenv = require('dotenv').config();

server.start(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));