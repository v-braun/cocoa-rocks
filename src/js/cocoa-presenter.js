var data = require('../data/data.compiled.json');
var debounce = require('lodash.debounce');
var throttle = require('lodash.throttle');
var find = require('lodash.find');

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

    markSelected(matchedEl.rollEl.id);
    
    matchedEl.rollEl.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center' });
    scrollToRollDebounced(matchedEl.rollEl);
  }
  
  scrolled = throttle(scrolled, 100);

  _ctx.postContainer.addEventListener('mousewheel', scrolled, false);
	_ctx.postContainer.addEventListener('DOMMouseScroll', scrolled, false);
}

function markSelected(id){
  var rollId = id;
  if(id.indexOf('roll_') !== 0){
    rollId = 'roll_' + id;
  }

  var elements = _ctx.visibleElements;
  for(var i = 0; i < elements.length; i++){
    var el = elements[i];
    if(el.rollEl.id == rollId){
      toggleClass(el.rollEl, 'in-view', true);
    }
    else{
      toggleClass(el.rollEl, 'in-view', false);
    }
  }  
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
  _ctx.postTpl = require('../templates/post.hbs');
  _ctx.rollTpl = require('../templates/roll-entry.hbs');

  _ctx.postContainer = document.getElementById('body');
  _ctx.rollContainer = document.getElementById('all-entries-roll');
  

  refresh();
  scrollSyncPostContainer();
}

function containsAll(filters, attributes){
  var items = filters.filter(value => -1 !== attributes.indexOf(value));
  return items.length == filters.length;
}

function filterData(filters, data){
  if(!filters || filters.length <= 0){
    return data;
  }

  var result = [];
  for(var i = 0; i < data.length; i++){
    var rec = data[i];
    var attributes = [rec.github.owner.login, rec.github.language, rec.github.license];
    attributes = attributes.concat(rec.tags);
    attributes = attributes.concat(rec.paltforms);
    
    if(containsAll(filters, attributes)) {
      result.push(rec);
    }
  }

  return result;
}

function refresh(filters){
  var filteredData = filterData(filters, data);
  
  _ctx.postContainer.innerHTML = '';
  _ctx.rollContainer.innerHTML = '';
  _ctx.visibleElements = [];
  for(var i = 0; i < filteredData.length; i++){
    var entry = filteredData[i];
    
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
module.exports.markSelected = markSelected;