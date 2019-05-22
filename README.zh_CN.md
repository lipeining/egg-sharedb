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
// config/plugin.js
exports.sharedb = {
  enable: true,
  package: 'egg-sharedb',
};
```

## 使用场景

在app.on('server') 保存得到的server,
在app.ready回调函数中，调用
app.sharedb.init(server);

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

<!-- 描述如何在单元测试中使用此插件，例如 schedule 如何触发。无则省略。-->

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
