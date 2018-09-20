var type = require('component-type');
var marked = require('marked');
var extname = require('path').extname;

module.exports = plugin;

// Is the file markdown?
function markdown(file) {
  return /\.md$|\.markdown$/.test(extname(file));
};

function plugin(options) {
  options = options || {};

  return function (files, metalsmith, done) {
    setImmediate(done);

    if (type(options.name) !== 'string') {
      options.name = 'contents_original';
    } 

    Object.entries(files).forEach(([filename, file]) => {
      if (!markdown(filename)) return;

      let fileContentString = file.contents.toString('utf8');
      let fileContentHtml = marked(fileContentString);
      let fileContentBuffer = Buffer.from(fileContentHtml, 'utf8' );

      file[options.name] = fileContentBuffer;
    });
  }
}