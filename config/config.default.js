'use strict';

/**
 * egg-sharedb default config
 *
 * database: { }
 * database: { type: 'memory' }
 * database: { type: 'mongo', url: 'mongodb://' }
 * database: { type: 'mingo-memory' }
 *
 * // 暂时不使用pubsub,需要指定redisClient.
 * pubsub: {}
 * pubsub: { type: 'memory' }
 * pubsub: { type: 'redis-pubsub', client: '' }
 *
 * @member Config#sharedb
 * @property {String} SOME_KEY - some description
 */
exports.sharedb = {
  // client 单实例， clients多实例
  client: {
    // 可以指定 database, pubsub
    database: {
      type: 'memory',
    },
  },
};
