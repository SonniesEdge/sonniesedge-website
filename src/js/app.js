var FontFaceObserver = require('font-face-observer');
var fontA = new FontFaceObserver('Roboto Slab');
var fontB = new FontFaceObserver('Open Sans');

Promise.all([fontA.check(), fontB.check()]).then(function () {
  document.documentElement.classList.add('fonts-loaded');
});
