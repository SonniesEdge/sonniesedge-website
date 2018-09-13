var request = require('request');
var slugify = require('slugify');
var marked = require('marked');
var type = require('component-type');
var querystring = require('query-string');
var fetch = require('isomorphic-fetch');
var fs = require('fs');
var unzip = require('unzip');

module.exports = plugin;

// function 

function plugin(options) {
    options = options || {};

    return function (files, metalsmith, done) {
        try {
            if (!process.env.DROPBOXTOKEN) {
                console.log('No Dropbox token specified.');
                setImmediate(done); // effectively feature flag this
                // throw new Error('Webmentions.io key is not defined in env vars!');
            } else {
                 // or another library of choice.
                var Dropbox = require('dropbox').Dropbox;
                var dbx = new Dropbox({ accessToken: process.env.DROPBOXTOKEN, fetch: fetch });
                dbx.filesDownloadZip({path: '/test'})
                    .then((result) => {
                        fs.writeFile('test.zip', result.fileBinary, 'binary', (err) => {
                            console.log('done');
                            fs.createReadStream('test.zip').pipe(unzip.Extract({ path: './' }));
                        });
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