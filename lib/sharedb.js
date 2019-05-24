'use strict';

const ShareDB = require('sharedb');
const richText = require('rich-text');
const uuid = require('uuid/v4');
const WebSocket = require('ws');
const debug = require('debug')('egg-sharedb:lib:sharedb.js');
const ShareDBMingo = require('sharedb-mingo-memory');
const ShareDBMongo = require('sharedb-mongo');
const WebSocketJSONStream = require('websocket-json-stream');
/**
 * mount apqp on app
 * @param {Application} app app
 */
module.exports = app => {
    app.addSingleton('sharedb', createClient);
};

function parseConfig(config) {
    const database = config.database || { type: 'memory' };
    let db;
    if (database.type === 'mongo') {
        db = ShareDBMongo(database.url);
    } else if (database.type === 'mingo-memory') {
        db = new ShareDBMingo();
    } else {
        db = new ShareDB.MemoryDB();
    }
    debug('db is:');
    debug(db);
    return { db };
}

async function createClient(config, app) {
    // 判断config中的database pubsub
    app.coreLogger.info(`[egg-sharedb] start on ${JSON.stringify(config, null, 2)}`);
    ShareDB.types.register(richText.type);
    const sharedb = new ShareDB(parseConfig(config));
    // 现在的sharedb对象是 闭包，保证和app.sharedb是同一个单例实例
    app.on('server', server => {
        debug('on server callback');
        debug(server);
        // Connect any incoming WebSocket connection to ShareDB
        const wss = new WebSocket.Server({ server });
        // app.wss = wss;
        wss.on('connection', function(ws, req) {
            // generate an id for the socket
            ws.id = uuid();
            ws.isAlive = true;

            debug('A new client (%s) connected.', ws.id);
            const stream = new WebSocketJSONStream(ws);
            sharedb.listen(stream, req);
        });
    });
    app.coreLogger.info('[egg-sharedb] start success');
    return sharedb;
}