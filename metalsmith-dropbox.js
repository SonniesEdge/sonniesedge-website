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
                throw new Error('Dropbox key is not defined in env vars!');
            } else {
                var Dropbox = require('dropbox').Dropbox;
                var dbx = new Dropbox({ accessToken: process.env.DROPBOXTOKEN });
                dbx.filesListFolder({path: '/test'})
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });

                setImmediate(done);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}