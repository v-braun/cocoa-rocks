var data = require('../assets/data.compiled.json');
var Handlebars = require('handlebars');
var debounce = require('lodash.debounce');
var throttle = require('lodash.throttle');

var _ctx = {
  postContainer: null,
  rollContainer: null,
  postTpl: null,
  rollTpl: null,

  visibleElements: []
}


function toggleClass(el, cls, enabled){
  if(enabled){
    el.classList.add(cls);
  }
  else{
    el.classList.remove(cls);
  }
}
function hasClass(el, cls){
  return el.classList.contains(cls);
}

var scrollToRollDebounced = debounce((el) => {
  el.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center' });
}, 500);

function scrollSyncPostContainer(){
  function scrolled(e){
    var elements = _ctx.visibleElements;
    var matchedEl = null;
    for(var i = 0; i < elements.length; i++){
      var el = elements[i];
      var rect = el.postEl.getBoundingClientRect();
      if(rect.left > -250 && rect.left < 250){
        matchedEl = el;
        break;
      }
    }
    if(!matchedEl){
      return;
    }
    
    if(hasClass(matchedEl.rollEl, 'in-view')){
      return;
    }

    for(var i = 0; i < elements.length; i++){
      var el = elements[i];
      toggleClass(el.rollEl, 'in-view', false);
    }
    
    toggleClass(matchedEl.rollEl, 'in-view', true);
    matchedEl.rollEl.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center' });
    scrollToRollDebounced(matchedEl.rollEl);
  }
  
  scrolled = throttle(scrolled, 100);

  _ctx.postContainer.addEventListener('mousewheel', scrolled, false);
	_ctx.postContainer.addEventListener('DOMMouseScroll', scrolled, false);
}


function parseElement(html) {
  var div = document.createElement('div');
  div.innerHTML = html.trim();
  
  return div.firstChild; 
}

function applyTemplateAndAdd(holder, post, template){
  var src = template(post);
  var el = parseElement(src);
  holder.appendChild(el);
  return el;
}


function render(){
  var postTplSrc = document.getElementById('entry-template').innerHTML;
  _ctx.postTpl = Handlebars.compile(postTplSrc);
  
  var rollTplSrc = document.getElementById('roll-entry-template').innerHTML;
  _ctx.rollTpl = Handlebars.compile(rollTplSrc);  

  _ctx.postContainer = document.getElementById('body');
  _ctx.rollContainer = document.getElementById('all-entries-roll');
  

  refresh();
  scrollSyncPostContainer();
}

function refresh(){

  
  _ctx.postContainer.innerHTML = '';
  _ctx.rollContainer.innerHTML = '';
  _ctx.visibleElements = [];
  for(var i = 0; i < data.length; i++){
    var entry = data[i];
    
    var postEl = applyTemplateAndAdd(_ctx.postContainer, entry, _ctx.postTpl);
    var rollEl = applyTemplateAndAdd(_ctx.rollContainer, entry, _ctx.rollTpl);
    _ctx.visibleElements.push({
      postEl: postEl,
      rollEl: rollEl
    });
  }
  
  
  // elements[0].rollEl.classList.add('in-view');
  
}

module.exports.render = render;
module.exports.refresh = refresh;