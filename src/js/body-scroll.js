var invertScroll = require('./utils/invert-scroll');

module.exports.init = () => {
  var b = document.getElementById('body');
  invertScroll(b, 12);
};

