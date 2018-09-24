var Selectr = require('mobius1-selectr');

var selects = {
  sortSelect: null,
  tagsSelect: null,
  licenseSelect: null,
  platformSelect: null
}


module.exports.init = () => {
  selects.sortSelect = new Selectr('#filter-sort', {
    searchable: false
  });
  
  selects.tagsSelect = new Selectr('#filter-tags');
  selects.licenseSelect = new Selectr('#filter-license');
  selects.platformSelect = new Selectr('#filter-platform', {searchable: false});
  
  selects.sortSelect.disable();
  selects.tagsSelect.disable();
  selects.licenseSelect.disable();
  selects.platformSelect.disable();
  
};

module.exports.selected = (name) => {
  if(!selects.sortSelect){
    throw new Error('please call init first');
  }
  
  return selects[name];
}