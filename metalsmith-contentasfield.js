var request = require('request');
var slugify = require('slugify');
var marked = require('marked');
var type = require('component-type');
var querystring = require('query-string');

module.exports = plugin;

function plugin(options) {
  options = options || {};

  return function (files, metalsmith, done) {

    setImmediate(done);

  }
}