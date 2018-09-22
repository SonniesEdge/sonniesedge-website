var _ = require('lodash');
var moment = require('moment-timezone');
moment.tz.setDefault("Europe/Berlin");

module.exports = function (options) {
  var override = (('boolean' === typeof options) && options) || ('object' === typeof options && options.override) || false;
  
  return function drafts(files, metalsmith, done) {
    _.forEach(files, function (fileMeta, fileName) {
      if (!override && fileMeta.date) {
        return;
      }
      var m;
      if (m = fileName.match(/(\d{4}-\d{2}-\d{2}t\d{2}-\d{2})/)) {
        console.log('DATE: ', m[1]);

        let date = m[1];

        var momentDate = moment(date, 'YYYY-MM-DD[t]hh:mm');
        var jsDate = momentDate.toDate();

        console.log('Moment date: ', momentDate);
        console.log('JS date: ', jsDate);

        fileMeta.date = new Date(jsDate);
      }
    });

    var filesWithoutContents = _.zipObject(_.map(files, function (fileMeta, fileName) {
      var filteredFileMeta = _.reduce(fileMeta, function (acc, metaValue, metaName) {
        if ('contents' !== metaName) {
          acc[metaName] = metaValue;
        }
        return acc;
      }, {});
      return [fileName, filteredFileMeta];
    }));
    done();
  };
};
