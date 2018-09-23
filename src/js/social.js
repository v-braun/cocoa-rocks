
function open(url) {
  // var width = 500;
  // var height = 300;

  // var left = (screen.width / 2) - (width / 2);
  // var top = (screen.height / 2) - (height / 2);

  window.open(
    url,
    '_blank'
    //,
    //"menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
  );
}

function extractData(el){
  if(!el) return null;
  var desc = el.dataset.desc;
  var banner = el.dataset.banner;
  var url = el.dataset.url;

  return {
    desc: desc,
    banner: banner,
    url: url
  };
}

function pin(el){
  if(!el) return;

  var data = extractData(el);


  var shareUrl = 'https://www.pinterest.com/pin/create/button/';
  shareUrl += '?url=' + encodeURIComponent(data.url);
  shareUrl += '&media=' + encodeURIComponent(data.banner);
  shareUrl += '&description=' + encodeURIComponent(data.desc);
  shareUrl += '&hashtags=' + encodeURIComponent('cocoa-rocks, cocoa, ios');
  
  open(shareUrl);
}

function fbshare(el){
  if(!el) return;

  var data = extractData(el);

  var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=';
  shareUrl += encodeURIComponent(data.url);

  open(shareUrl);
}

function tweet(el){
  if(!el) return;

  var data = extractData(el);

  var shareUrl = 'https://twitter.com/intent/tweet/';
  shareUrl += '?text=' + encodeURIComponent(data.desc);
  shareUrl += '&url=' + encodeURIComponent(data.url);
  shareUrl += '&via=' + encodeURIComponent('cocoa-rocks');
  shareUrl += '&hashtags=' + encodeURIComponent('cocoa-rocks, cocoa, ios');
  
  open(shareUrl);
}

function star(el){
  if(!el) return;
  
  var data = extractData(el);

  open(data.url);
}

module.exports = {
  pin: pin,
  tweet: tweet,
  fbshare: fbshare,
  star: star
};

if(window){
  window.social = module.exports;
}
if(document){
  document.social = module.exports;
}