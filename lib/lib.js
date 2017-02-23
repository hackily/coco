const fs = require('fs');
const path = require('path');

module.exports.getCurrentDirectoryBase = function(){
  return path.basename(process.cwd());
}

module.exports.fileExists = function(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

module.exports.isDir = function(filePath){
  return fs.existsSync(filePath);
};

// module.exports.getFile = function(filePath){
//   return fs.statSync(filePath);
// };

module.exports.readFile = function(filePath){
  return fs.readFileSync(filePath, 'utf-8');
};

