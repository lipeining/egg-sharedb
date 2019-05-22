'use strict';

const ShareDB = require('sharedb');
const richText = require('rich-text');
const session = require('koa-session');
const uuid = require('uuid/v4');
const WebSocket = require('ws');
const http = require('http');
const WebSocketJSONStream = require('websocket-json-stream');
/**
 * mount apqp on app
 * @param {Application} app app
 */
module.exports = app => {
    app.addSingleton('sharedb', createClient);
};

async function createClient(config, app) {
    // 判断config中的database pubsub
    app.coreLogger.info(`[egg-sharedb] start on ${JSON.stringify(config, null, 2)}`);
    ShareDB.types.register(richText.type);
    const sharedb = new ShareDB(config);
    // 应该在这里监听对应的server，如果是在app.js中的话，对应的app.sharedb不一定存在
    // 现在的sharedb对象是 闭包，保证和app.sharedb是同一个单例实例
    app.on('server', server => {
        console.log('on server callback');
        // 可以得到app.sharedb
        console.log(app.sharedb);
        console.log(server);
        // no need to send back the error message the next('message') help us!
        // if you want to send message ,use Object ,not string!
        // 如果是服务器node使用的话，不会有session。
        sharedb.use('connect', function(request, next) {
            console.log('sharedb on connnect');
            if (request.req) {
                if (config.session) {
                    console.log('sharedb Parsing session from request...');
                    const sessionOpts = {
                        maxAge: 24 * 3600 * 1000, // ms
                        key: 'EGG_SESS',
                        httpOnly: true,
                        encrypt: true,
                    };
                    // 可以得到eggjs内置的session设置
                    console.log(app.config.session);
                    const sessionParser = session(app.config.session || sessionOpts, app);
                    const ctx = app.createContext(request.req, new http.ServerResponse(request.req));
                    sessionParser(ctx, () => {
                        console.log('sharedb Session is parsed!');
                        console.log(request.req.session);
                        // 无法打印到直接的sessionSymbol
                        console.log(JSON.stringify(ctx, null, 2));
                        console.log(ctx.session);
                        //
                        // 这里保存到agent.connectSession
                        // i do  know  it is unable to access collection
                        // i do  know  it is unable to access id
                        request.agent.connectSession = request.req.session;
                        // console.log(`on ${request.action}-start-`);
                        // console.log(request.collection);
                        // console.log(request.id);
                        // console.log(`on ${request.action}-end-`);
                        // console.log(request.agent.stream.ws);
                        // connect do not check permission
                        next();
                    });
                } else {
                    next();
                }
            } else {
                next();
            }
        });
        // 应该只有一个server
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

            console.log('A new client (%s) connected.', ws.id);
            var stream = new WebSocketJSONStream(ws);
            app.sharedb.listen(stream, req);

            // ws.on('pong', function(data, flags) {
            //     console.log('Pong received. (%s)', ws.id);
            //     ws.isAlive = true;
            // });

            // ws.on('error', function(error) {
            //     console.log('Client connection errored (%s). (Error: %s)', ws.id, error);
            // });
        });
        // wss.on('close', () => {
        //     if (app.sharedb.pingTicker) {
        //         clearInterval(app.sharedb.pingTicker);
        //         app.sharedb.pingTicker = null;
        //     }
        // });
        // // Sockets Ping, Keep Alive
        // app.sharedb.pingTicker = setInterval(function() {
        //     wss.clients.forEach(function(ws) {
        //         if (ws.isAlive === false) return ws.terminate();

        //         ws.isAlive = false;
        //         ws.ping();
        //         console.log('Ping sent. (%s)', ws.id);
        //     });
        // }, 30000);
    });
    app.coreLogger.info('[egg-sharedb] start success');
    return sharedb;
}