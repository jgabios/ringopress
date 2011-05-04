/**
 * @fileOverview Here we have all our ringojs configuration directives
 * 
 */
exports.httpConfig = {
    staticDir: 'static'
};


exports.middleware = [
    'ringo/middleware/etag',
    'ringo/middleware/responselog',
    'ringo/middleware/error',
    'ringo/middleware/notfound',
    // 'ringo/middleware/profiler',
];

exports.app = require('ringo/webapp').handleRequest;

exports.macros = [
    'ringo/skin/macros',
    'ringo/skin/filters',
];

exports.charset = 'UTF-8';
exports.contentType = 'text/html';

exports.store = require('ringo/storage/googlestore');

exports.urls = [
    ['/admin','adminactions'],
    ['/', 'actions']
];

exports.akismet = {
    apikey: 'XXXXXXXXXXXXX',
    blog: 'http://XXXX.XXXXXX.XXXX'
}
