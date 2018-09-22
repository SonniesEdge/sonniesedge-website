var extname = require('path').extname;

module.exports = plugin;

function plugin(options) {
  options = options || {};

  return function (files, metalsmith, done) {
    setImmediate(done);
    Object.entries(metalsmith.metadata()[options.collection]).forEach(([filename, file]) => {
      // Set the title as the date
      if (file['date']) {
        file['title'] = file['date'];
      }
    });
  }
}