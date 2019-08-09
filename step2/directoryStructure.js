var fs = require('fs');
var path = require('path');

// https://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js
// sets default dir as the parent of current directory
function getStruct(dir = path.resolve(__dirname, '..')) {
  var stats = fs.lstatSync(dir);
  var info = { path: dir };
  if (stats.isDirectory()) {
    info.type = 'folder';
    info.children = fs.readdirSync(dir).map((file) => {
      return getStruct(dir + '/' + file);
    });
  } else {
    info.type = 'file';
  }
  return info;
}

function createStruct(struct, targetRoot = __dirname) {
  if (struct.type === 'file') return;
  var folderName = path.basename(struct.path);
  var newDir = targetRoot + '/' + folderName;
  fs.mkdirSync(newDir);
  struct.children.forEach((child) => {
    createStruct(child, newDir)
  });
}

// // test getStruct
// console.log(JSON.stringify(getstruct()));

// test createstruct
// createStruct(getStruct());
