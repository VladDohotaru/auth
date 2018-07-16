'use strict';

const express = require('express');
const config = require('./config.js');
const app = express();

app.get('/', (req, res) => res.send('Hello World'));

app.listen(config.get('server.port'), () => console.log('Started'));