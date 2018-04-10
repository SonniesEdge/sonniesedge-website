var request = require('request');
var type = require('component-type');

module.exports = plugin;

console.log(process.env.WEBMENTTOKEN); 

function plugin(options) {

    options = options || {};

    return function(files, metalsmith, done){
        try {
            if (!process.env.WEBMENTTOKEN) {
                setImmediate(done); // effectively feature flag this
                // throw new Error('Webmentions.io key is not defined in env vars!');
            }  else {
                let apiUrl = `https://webmention.io/api/mentions?domain=sonniesedge.co.uk&token=${process.env.WEBMENTTOKEN}&per-page=20`;
        
                request.get({url: apiUrl, json: true}, (err, response) => {
                    let apiData = response.body;
        
                    console.log(apiData['links'].length);
        
                    for (var i = 0, len = apiData['links'].length; i < len; i++) {
                        // if api URL matches the current file URL then...
                        // console.log(apiData['links'][i]['source']);
                    }
            
        
                    // Loop through each file
                    Object.keys(files).forEach(function(file){
                        var data = files[file];
        
                        // Loop through each value in api object
                        for (var i = 0, len = apiData.length; i < len; i++) {
                            // if api URL matches the current file URL then...
                         
                        }
        
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
