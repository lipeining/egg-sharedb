'use strict';

const mock = require('egg-mock');
const WebSocket = require('ws');
const sharedb = require('sharedb/lib/client');
const richText = require('rich-text');
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
});
