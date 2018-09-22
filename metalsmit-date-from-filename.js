var moment = require('moment');

module.exports = function (options) {
  var override = (('boolean' === typeof options) && options) || ('object' === typeof options && options.override) || false;
  
  return function drafts(files, metalsmith, done) {
    Object.entries(files).forEach(([fileName, fileMeta]) => {
      if (!override && fileMeta.date) {
        return;
      }
      let date = fileName.match(/(\d{4}-\d{2}-\d{2}t\d{2}-\d{2})/)
      if (date) {
        let momentDate = moment(date[1], 'YYYY-MM-DD[t]HH:mm').format('YYYY-MM-DD HH:mm');
        fileMeta.date = momentDate;
      }
    });
    
    done();
  };
};
