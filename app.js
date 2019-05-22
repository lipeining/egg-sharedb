'use strict';
const sharedb = require('./lib/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream');
module.exports = app => {
    sharedb(app);
    var serverList = [];
    app.on('server', server => {
        serverList.push(server);
        // console.log(server);
        // console.log(app);
        // 这里是读取不到app.sharedb的
        // console.log(app.sharedb);
    });
    app.on('error', (err, ctx) => {

    });
    app.ready(() => {
        console.log('on ready callback');
        // 可以得到app.sharedb
        console.log(app.sharedb);
        // 应该只有一个server
        console.log(serverList.length);
        for (const server of serverList) {
            const shareConnection = app.sharedb.connect();
            const storeDoc = shareConnection.get('examples', 'richtext');
            storeDoc.fetch(function(err) {
                if (err) throw err;
                if (storeDoc.type === null) {
                    storeDoc.create([{ insert: 'Hi!' }], 'rich-text');
                    return;
                }
            });
            // Connect any incoming WebSocket connection to ShareDB
            var wss = new WebSocket.Server({ server: server });
            // app.wss = wss;
            wss.on('connection', function(ws, req) {
                // generate an id for the socket
                ws.id = uuid();
                ws.isAlive = true;

                debug('A new client (%s) connected.', ws.id);
                var stream = new WebSocketJSONStream(ws);
                app.sharedb.listen(stream, req);

                // ws.on('pong', function(data, flags) {
                //     debug('Pong received. (%s)', ws.id);
                //     ws.isAlive = true;
                // });

                // ws.on('error', function(error) {
                //     debug('Client connection errored (%s). (Error: %s)', ws.id, error);
                // });
            });
            // // Sockets Ping, Keep Alive
            // app.sharedb.pingTicker = setInterval(function() {
            //     wss.clients.forEach(function(ws) {
            //         if (ws.isAlive === false) return ws.terminate();

            //         ws.isAlive = false;
            //         ws.ping();
            //         debug('Ping sent. (%s)', ws.id);
            //     });
            // }, 30000);
        }
    });
};