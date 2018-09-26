var path = require('path');



exports.paths = {
  src: 'src',
  dist: 'bin',
  tmp: 'tmp',
  root: "."
};

exports.path = {};
for (const pathName in exports.paths) {
  if (Object.prototype.hasOwnProperty.call(exports.paths, pathName)) {
    exports.path[pathName] = function () {
      const pathValue = exports.paths[pathName];
      const funcArgs = Array.prototype.slice.call(arguments);
      const joinArgs = [pathValue].concat(funcArgs);
      return path.join.apply(this, joinArgs);
    };
  }
}

exports.connect = {
  port: 3333,
  livereload: true  
}