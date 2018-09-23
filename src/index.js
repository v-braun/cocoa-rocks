var bodyScroll = require('./js/body-scroll');
var filters = require('./js/filters');
var ready = require('./js/utils/ready');
var presenter = require('./js/cocoa-presenter');
var smoothscroll = require('smoothscroll-polyfill');


require('./js/social');
require('./js/nav');

// var data = require('./assets/data.compiled.json');

ready(() => {
  // bodyScroll.init();
  smoothscroll.polyfill();
  filters.init();
  presenter.render();
});


