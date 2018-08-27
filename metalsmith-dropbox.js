var request = require('request');
var slugify = require('slugify');
var marked = require('marked');
var type = require('component-type');
var querystring = require('query-string');

module.exports = plugin;

function plugin(options) {
    options = options || {};

    return function (files, metalsmith, done) {
        try {
            if (!process.env.DROPBOXTOKEN) {
                console.log('No Dropbox token specified.');
                setImmediate(done); // effectively feature flag this
                // throw new Error('Webmentions.io key is not defined in env vars!');
            } else {
                setImmediate(done);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}