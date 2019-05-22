'use strict';
const sharedb = require('./lib/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream');
module.exports = app => {
    sharedb(app);
};