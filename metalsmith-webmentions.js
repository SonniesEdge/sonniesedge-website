var request = require('request');
var type = require('component-type');

module.exports = plugin;

// console.log(process.env.WEBMENTTOKEN); 

function plugin(options) {

    options = options || {};

    return function(files, metalsmith, done){
        try {
            if (!process.env.WEBMENTTOKEN) {
                setImmediate(done); // effectively feature flag this
                // throw new Error('Webmentions.io key is not defined in env vars!');
            }  else {
                let apiUrl = `https://webmention.io/api/mentions?domain=sonniesedge.co.uk&token=${process.env.WEBMENTTOKEN}&per-page=2000`;
        
                request.get({url: apiUrl, json: true}, (err, response) => {
                    let apiData = response.body;
           
        
                    // Loop through each file
                    Object.keys(files).forEach(function(file){
                        var data = files[file];

                        let webmentionCount = 0;

                        // Loop through each value in api object
                        for (var i = 0, len = apiData['links'].length; i < len; i++) {
                            // if api URL matches the current file URL then...
                            if (apiData['links'][i]['target'] === metalsmith.metadata().site.url + files[file]['path']) {
                                // console.log(metalsmith.metadata().site.url + files[file]['path'] + ' got a ' + apiData['links'][i]['activity']['type']);
                                // console.log('API: ', apiData['links'][i]['target']);
                                // console.log('MS:  ', metalsmith.metadata().site.url + files[file]['path']);
                                webmentionCount ++;
                            }
                        }
                        files[file]['webmentionCount'] = webmentionCount;
                    });

                    setImmediate(done);
                });
                
            }
        }
        catch(err) {
            console.log(err);
        }
    }
}
