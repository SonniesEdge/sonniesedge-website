var FontFaceObserver = require('font-face-observer');
var fontA = new FontFaceObserver('Roboto Slab');

Promise.all([fontA.check()]).then(function () {
  document.documentElement.classList.add('fonts-loaded');
});
