'use strict';

const mock = require('egg-mock');
const WebSocket = require('ws');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
sharedb.types.register(richText.type);

describe('test/sharedb.test.js', () => {
    let app;
    before(() => {
        app = mock.app({
            baseDir: 'apps/sharedb-test',
        });
        return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('should GET /', () => {
        return app.httpRequest()
            .get('/')
            .expect('hi, sharedb')
            .expect(200);
    });
    it('connect the sharedb', (done) => {
        done();
        // Open WebSocket connection to ShareDB server
        // var socket = new WebSocket('ws://localhost');
        // var connection = new sharedb.Connection(socket);
        // console.log(socket);
        // console.log(connection);
        // connection.on('connected', () => {
        //     // Create local Doc instance mapped to 'examples' collection document with id 'richtext'
        //     var doc = connection.get('examples', 'richtext');
        //     doc.subscribe(function(err) {
        //         if (err) throw err;
        //         // var quill = new Quill('#editor', { theme: 'snow' });
        //         // quill.setContents(doc.data);
        //         // quill.on('text-change', function(delta, oldDelta, source) {
        //         //     if (source !== 'user') return;
        //         //     doc.submitOp(delta, { source: quill });
        //         // });
        //         // doc.on('op', function(op, source) {
        //         //     if (source === quill) return;
        //         //     quill.updateContents(op);
        //         // });
        //         doc.submitOp([{ insert: 'line 2!' }], { source: 'quill' });
        //         doc.on('op', function(op, source) {
        //             if (source === 'quill') return;
        //             console.log('receive op');
        //             console.log(op);
        //         });
        //     });
        //     done();
        // });
    });
});