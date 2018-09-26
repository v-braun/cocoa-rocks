var data = require('../data/data.compiled.json');
var Choices = require('choices.js');
var flatMap = require('lodash.flatmap');
var map = require('lodash.map');
var uniqBy = require('lodash.uniqby');
var filter = require('lodash.filter');

var selects = {
  sortSelect: null,
  tagsSelect: null,
  licenseSelect: null,
  platformSelect: null
}


function prependIfNotEmpty(prependStr, val){
  if(!val) return val;
  return prependStr + val;
}

module.exports.init = () => {
  var choices = flatMap(data, (val) => {
    var platforms = map(val.paltforms, (t) => {
      return {
        value: t, 
        label: prependIfNotEmpty('*', t)
      };
    });
    
    var license = {
      value: val.github.license,
      label: prependIfNotEmpty('§', val.github.license)
    };
    var language = {
      value: val.github.language,
      label: prependIfNotEmpty('&', val.github.language)
    };
    var owner = {
      value: val.github.owner.login,
      label: prependIfNotEmpty('@', val.github.owner.login)
    };
    var tags = map(val.tags, (t) => {
      return { 
        value: t, 
        label: prependIfNotEmpty('#', t) 
      };
    });

    
    var all = tags.concat(tags)
                  .concat(platforms)
                  .concat([license])
                  .concat([language])
                  .concat([owner]);

    val.match = function(){
      var findings = filter(arguments, (val) => all.indexOf(val));
      console.log(arguments);
      console.log(findings);
      return findings.length > 0;
    }
    return all;
  });

  choices = filter(choices, (val) => val.value);
  choices = uniqBy(choices, (val) => val.value);
  

  var el = document.getElementById('filter-input')
  var selection = new Choices(el, {
    maxItemCount: 3,
    duplicateItems: false,
    paste: false,
    choices: choices
  });
  
  selection.passedElement.addEventListener('choice', function(event) {
    if(!event || !event.detail || !event.detail.choice) return;
    // data[0].match(event.detail.choice);
  }, false);  

  selection.disable();
  

  // selects.tagsSelect = new Choices('#filter-tags');
  // selects.licenseSelect = new Choices('#filter-license');
  // selects.platformSelect = new Choices('#filter-platform');
  
  // selects.sortSelect.disable();
  // selects.tagsSelect.disable();
  // selects.licenseSelect.disable();
  // selects.platformSelect.disable();
  
};

module.exports.selected = (name) => {
  if(!selects.sortSelect){
    throw new Error('please call init first');
  }
  
  return selects[name];
}