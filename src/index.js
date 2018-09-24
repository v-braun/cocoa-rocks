var bodyScroll = require('./js/body-scroll');
var filters = require('./js/filters');
var ready = require('./js/utils/ready');
var presenter = require('./js/cocoa-presenter');
var smoothscroll = require('smoothscroll-polyfill');
var nameTgl = require('./js/name-toggle');

require('./js/social');
require('./js/nav');

ready(() => {
  // bodyScroll.init();

  window.__forceSmoothScrollPolyfill__ = true;
  smoothscroll.polyfill();

  nameTgl.start();

  filters.init();
  presenter.render();
});


