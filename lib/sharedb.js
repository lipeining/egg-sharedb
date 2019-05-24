'use strict';

const ShareDB = require('sharedb');
const richText = require('rich-text');
const session = require('koa-session');
const uuid = require('uuid/v4');
const WebSocket = require('ws');
const http = require('http');
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
        // no need to send back the error message the next('message') help us!
        // if you want to send message ,use Object ,not string!
        // 如果是服务器node使用的话，不会有session。
        sharedb.use('connect', function(request, next) {
            debug('sharedb on connnect');
            if (request.req) {
                debug('sharedb Parsing session from request...');
                const sessionOpts = {
                    maxAge: 24 * 3600 * 1000, // ms
                    key: 'EGG_SESS',
                    httpOnly: true,
                    encrypt: true,
                };
                // 可以得到eggjs内置的session设置
                debug(app.config.session);
                const sessionParser = session(app.config.session || sessionOpts, app);
                const ctx = app.createContext(request.req, new http.ServerResponse(request.req));
                sessionParser(ctx, () => {
                    debug('sharedb Session is parsed!');
                    // 无法打印到直接的sessionSymbol
                    debug(JSON.stringify(ctx, null, 2));
                    debug(ctx.session);
                    // 这里保存到agent.connectSession
                    // i do  know  it is unable to access collection
                    // i do  know  it is unable to access id
                    // debug(`on ${request.action}-start-`);
                    // debug(request.collection);
                    // debug(request.id);
                    // debug(`on ${request.action}-end-`);
                    // debug(request.agent.stream.ws);
                    // connect do not check permission
                    next();
                });
            } else {
                next();
            }
        });
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