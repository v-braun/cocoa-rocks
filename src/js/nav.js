var presenter = require('./cocoa-presenter')

function gotoPost(name){
  if(!name) return;
  
  const SCROLL_TIME = 1000;

  var postName = 'post_' + name;
  var rollName = 'roll_' + name;
  
  var postEl = document.getElementById(postName);
  var rollEl = document.getElementById(rollName);
  

  postEl.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start' });
  setTimeout(() => {
    rollEl.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center' });
    presenter.markSelected(rollEl.id);
  }, SCROLL_TIME);
  
}

module.exports.gotoPost = gotoPost;

if(window){
  window.nav = module.exports;
}
if(document){
  document.nav = module.exports;
}