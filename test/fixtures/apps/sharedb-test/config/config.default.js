'use strict';

exports.keys = '123456';
/**
 * egg-sharedb default config
 * @member Config#sharedb
 * @property {String} SOME_KEY - some description
 */
exports.sharedb = {
  // client 单实例， clients多实例
  client: {
    // 可以指定 database, pubsub
  },
};
