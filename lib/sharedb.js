'use strict';

const ShareDB = require('sharedb');
const richText = require('rich-text');
const session = require('koa-session');
const util = require('util');
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
    app.coreLogger.info('[egg-sharedb] start success');
    const sessionParser = session(app);
    console.log(sessionParser);
    // no need to send back the error message the next('message') help us!
    // if you want to send message ,use Object ,not string!
    // 如果是服务器node使用的话，不会有session。
    sharedb.use('connect', function(request, next) {
        console.log('sharedb on connnect');
        // console.log(util.inspect(request, {
        //     depth: 2
        // }));
        console.log(util.inspect(request.req, {
            depth: 2
        }));
        console.log('sharedb Parsing session from request...');
        // console.log(request.req.session);
        if (request.req) {
            sessionParser(request.req, {}, () => {
                console.log('sharedb Session is parsed!');
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
    });
    return sharedb;
}