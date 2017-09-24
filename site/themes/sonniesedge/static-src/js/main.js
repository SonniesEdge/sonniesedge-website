var FontFaceObserver = require('font-face-observer');
var observer = new FontFaceObserver('My Family', {
  weight: 400
});

observer.check().then(function () {
  console.log('Font is available');
}, function () {
  console.log('Font is not available');
});
