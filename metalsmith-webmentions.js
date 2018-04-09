var request = require('request');
var type = require('component-type');

module.exports = plugin;

console.log(process.env.WEBMENTTOKEN); 

function plugin(options) {

    options = options || {};

    return function(files, metalsmith, done){
        setImmediate(done);
        Object.keys(files).forEach(function(file){
            var data = files[file];
        });
    }
}
