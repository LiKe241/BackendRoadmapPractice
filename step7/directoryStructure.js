const fs = require('fs');
const path = require('path');

/* eslint security/detect-non-literal-fs-filename: "off", no-sync: "off" */

// https://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js
// sets default dir as the parent of current directory
exports.getStruct = function getStruct(dir = path.resolve(__dirname, '..')) {
  try {
    const stats = fs.lstatSync(dir);
    const info = { path: dir };

    if (stats.isDirectory()) {
      info.type = 'folder';
      info.children = fs.readdirSync(dir).map(file => getStruct(dir + '/' + file));
    } else {
      info.type = 'file';
    }
    return info;
  } catch (e) { throw e; }
};

exports.createStruct = async function createStruct(struct, targetRoot = __dirname) {
  try {
    if (struct.type === 'file') return;
    const folderName = path.basename(struct.path);
    const newDir = targetRoot + '/' + folderName;
    await fs.mkdirSync(newDir);
    struct.children.forEach(async (child) => await createStruct(child, newDir));
  } catch (e) { throw e; }
};

// // test getStruct
// console.log(JSON.stringify(exports.getStruct()));

// // test createstruct
// exports.createStruct(exports.getStruct());
