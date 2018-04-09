var request = require('request');
var slugify = require('slugify');
var marked = require('marked');

module.exports = plugin;

function plugin(options) {
    options = options || {};



    return function (files, metalsmith, done) {
        let options = {
            url: 'https://feeds.pinboard.in/json/u:sonniesedge/t:web?count=10',
            json: true
        }

        let pinboardData = [];

        request.get(options, (err, response) => {
            let pinboardData = response.body;

            let prefix = 'bookmarks';

            for (var i = 0, len = pinboardData.length; i < len; i++) {
                let filename = slugify(pinboardData[i]['u'], {
                    replacement: '-',
                    lower: true,
                    remove: /[$*_+~.()'"!\-/:@]/g
                  });

                filename = `${prefix}/${filename}.html`;
                
                files[filename] = {
                    'title': pinboardData[i]['d'],
                    'contents': Buffer.from(marked(pinboardData[i]['n']), 'utf8' ),
                    'date': pinboardData[i]['dt']
                }
            }



            setImmediate(done);
        });








    }
}