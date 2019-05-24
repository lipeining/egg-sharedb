# egg-sharedb

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-sharedb.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-sharedb
[travis-image]: https://img.shields.io/travis/eggjs/egg-sharedb.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-sharedb
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-sharedb.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-sharedb?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-sharedb.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-sharedb
[snyk-image]: https://snyk.io/test/npm/egg-sharedb/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-sharedb
[download-image]: https://img.shields.io/npm/dm/egg-sharedb.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-sharedb

<!--
Description here.
-->

## 依赖说明

### 依赖的 egg 版本

egg-sharedb 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

### 依赖的插件
<!--

如果有依赖其它插件，请在这里特别说明。如

- security
- multipart

-->

## 开启插件


```js
config.xxx.js
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
exports.sharedb = {}
```
```js
// config/plugin.js
exports.sharedb = {
  enable: true,
  package: 'egg-sharedb',
};
```

## 使用场景
最佳实践：使用MongoDB进行存储，遵循sharedb的API，正确地建立初始化文档内容。
普通测试环境，可以使用内存存储。

由服务端或者用户端保证文档的建立和初始化，之后的更新可以同步。
const doc = app.sharedb.get(collectionName,documentId);
if(doc.type===null) {
  doc.create([], 'rich-text');
}
// doc.subscribe();
用户可以自定义一个包装函数，保证新创建的文档不会和旧的文档相同。
如果想要操作数据库里面的ops,snapshots等，需要额外使用mongodb进行数据操作。
但是这样是无法保证数据的可恢复性。

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

<!-- 描述如何在单元测试中使用此插件，例如 schedule 如何触发。无则省略。-->

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
