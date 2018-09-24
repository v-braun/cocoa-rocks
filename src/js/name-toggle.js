var data = require('../data/data.compiled.json');

var _handle = null;

var el = document.getElementById('contributor_name');

function tick(){
    var rndControl = data[Math.floor(Math.random() * data.length)];
    var name = rndControl.github.owner.login;
    var url = rndControl.github.owner.html_url;

    setTimeout(() => {
        el.classList.add('hide');
        setTimeout(() => {
            el.innerText = name;
            el.href = url;
            el.classList.remove('hide');
        }, 800);
    }, 600)
    
}

module.exports.start = function(){
    if(_handle) return;
    tick();
    setInterval(tick, 5000);
}
module.exports.stop = function(){
    if(!_handle) return;
    clearInterval(_handle);
}