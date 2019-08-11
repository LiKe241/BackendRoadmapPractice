const fs = require('fs');
let currentDir = __dirname;

exports.cd = (newDir = __dirname) => {
  // no parameters received, changes to current module directory
  if (newDir === __dirname) {
    currentDir = newDir + '/';
    pwd();
  // changes to an absolute path
  } else if (newDir[0] == '/') {
    // tries to read newDir, changes to it if it can be read
    fs.readdir(newDir, (err, files) => {
      if (err) return console.error(err.stack);
      currentDir = newDir + '/';
      pwd();
    });
  // changes to a relative parent directory
  } else if (newDir.slice(0, 2) === '..') {
    parentDir = currentDir.split('/').slice(0, -1).join('/');
    if (parentDir === '') { return console.error('Error: currently in root!'); }
    newDir = parentDir + '/' + newDir.split('/').slice(1).join('/');
    currentDir = newDir;
    pwd();
    // changes to a sub-directory
  } else {
    newDir = currentDir + '/' + newDir + '/';
    // tries to read newDir, changes to it if it can be read
    fs.readdir(newDir, (err, files) => {
      if (err) return console.error(err.stack);
      currentDir = newDir;
      pwd();
    });
  }
}

function pwd() {
  console.log('Currently in: ' + currentDir);
}
