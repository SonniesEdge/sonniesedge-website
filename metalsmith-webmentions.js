var request = require('request');
var type = require('component-type');
var _ = require('lodash');
var moment = require('moment');

module.exports = plugin;

console.log(process.env.WEBMENTTOKEN);

function plugin(options) {

    options = options || {};

    return function (files, metalsmith, done) {
        try {
            if (!process.env.WEBMENTTOKEN) {
                console.log('No webmention token specified.');
                setImmediate(done); // effectively feature flag this
                // throw new Error('Webmentions.io key is not defined in env vars!');
            } else {
                let apiUrl = `https://webmention.io/api/mentions?domain=sonniesedge.co.uk&token=${process.env.WEBMENTTOKEN}&per-page=2000`;

                console.log('Webmention API URL: ', apiUrl);

                request.get({ url: apiUrl, json: true }, (err, response) => {
                    let apiData = response.body;

                    // Loop through each file
                    Object.keys(files).forEach(function (file) {
                        var data = files[file];

                        files[file]['webmentionCount'] = 0;

                        files[file]['webmentionReplies'] = [];
                        files[file]['webmentionLikes'] = [];
                        files[file]['webmentionReposts'] = [];
                        files[file]['webmentionLinks'] = [];

                        // Loop through each value in api object
                        for (var i = 0, len = apiData['links'].length; i < len; i++) {
                            // if api URL matches the current file URL then...
                            if (apiData['links'][i]['target'] === metalsmith.metadata().site.url + files[file]['path']) {
                                files[file]['webmentionCount']++;


                                if (apiData['links'][i]['activity']['type'] === 'like') {
                                    files[file]['webmentionCountLike']++;
                                    let payload = {};

                                    payload.author_name = _.get(apiData['links'][i], 'data.author.name', 'Unknown');
                                    payload.author_url = _.get(apiData['links'][i], 'data.author.url', 'Unknown');
                                    payload.id = _.get(apiData['links'][i], 'id', 0);

                                    files[file]['webmentionLikes'].push(payload);
                                }

                                if (apiData['links'][i]['activity']['type'] === 'repost') {
                                    files[file]['webmentionCountRepost']++;
                                    let payload = {};

                                    payload.author_name = _.get(apiData['links'][i], 'data.author.name', 'Unknown');
                                    payload.author_url = _.get(apiData['links'][i], 'data.author.url', 'Unknown');
                                    payload.repost_source = _.get(apiData['links'][i], 'data.url', 'Unknown');
                                    payload.date = moment(_.get(apiData['links'][i], 'data.published', '1970-01-01')).format("MMMM Do YYYY");
                                    payload.id = _.get(apiData['links'][i], 'id', 0);

                                    files[file]['webmentionReposts'].push(payload);
                                }

                                if (apiData['links'][i]['activity']['type'] === 'link') {
                                    files[file]['webmentionCountLink']++;

                                    if (_.get(apiData['links'][i], 'data.author.name', 'Unknown') !== 'Unknown') {
                                        let payload = {};

                                        payload.author_name = _.get(apiData['links'][i], 'data.author.name', 'Unknown');
                                        payload.author_url = _.get(apiData['links'][i], 'data.author.url', 'Unknown');
                                        payload.author_photo = _.get(apiData['links'][i], 'data.author.photo', 'Unknown');
                                        payload.date = moment(_.get(apiData['links'][i], 'data.published', '1970-01-01')).format("MMMM Do YYYY");
                                        payload.link_source = _.get(apiData['links'][i], 'data.url', 'Unknown');
                                        payload.content = _.get(apiData['links'][i], 'data.content', 'Unknown');
                                        payload.id = _.get(apiData['links'][i], 'id', 0);

                                        files[file]['webmentionLinks'].push(payload);
                                    }
                                }


                            }
                        }

                    });

                    setImmediate(done);
                });

            }
        }
        catch (err) {
            console.log('Webmention error: ', err);
        }
    }
}
