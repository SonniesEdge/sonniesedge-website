module.exports = plugin;

function plugin(options) {
  options = options || {};

  return function (files, metalsmith, done) {
    setImmediate(done);
    
    options.forEach((key) => {
      Object.entries(metalsmith.metadata()[key.collection]).forEach(([filename, file]) => {
        // Set the title as the date
        if (file['date']) {
          file['title'] = file['date'];
        }
      });
    });


  }
}