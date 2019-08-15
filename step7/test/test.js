const assert = require('assert');
const fs = require('fs');
const path = require('path');
const dirStruc = require('../directoryStructure.js');
// pahts of testing folders and files
const folderA = path.join(__dirname, '/folderA');
const folderB = path.join(__dirname, '/folderA/folderB');
const file1 = path.join(__dirname, '/folderA/file1');
const file2 = path.join(__dirname, '/folderA/folderB/file2');
const unreadable = '/qtpphqwzf215';

/* eslint
no-console: ["error", { allow: ["warn", "error"] }],
security/detect-object-injection: "off",
security/detect-non-literal-fs-filename: "off",
no-debugger: "off"
*/
describe('Unit Tests', function() {
  describe('directoryStructure.js Tests', function() {

    before('Creates sample directories and files to read', async function() {
      try {
        // creates testing folders and files
        await fs.mkdir(folderA, () => null);
        await fs.mkdir(folderB, () => null);
        let writerStream = await fs.createWriteStream(file1);
        writerStream.end();
        writerStream = await fs.createWriteStream(file2);
        writerStream.end();
      } catch (e) { console.error(e.stack); }
    });

    function recursiveAssert(result, expect) {
      // for each property in result
      for (const prop in result) {
        // current property is children
        if (Array.isArray(result[prop])) {
          // for each object in children, recursively asserts all properties
          // in the object are equal
          result[prop].forEach((child, index) => {
            recursiveAssert(child, expect[prop][index]);
          });
        // current property is path or type, asserts they are equal
        } else {
          assert.strictEqual(result[prop], expect[prop]);
        }
      }
    }
    const expectedStruct = {
      path: folderA,
      type: 'folder',
      children: [
        { path: file1,
          type: 'file' },
        { path: folderB,
          type: 'folder',
          children: [
            { path: file2,
              type: 'file'}
          ]}
      ]
    };
    const expectedFolders = {
      path: folderA,
      type: 'folder',
      children: [
        { path: folderB,
          type: 'folder',
          children: []}
      ]
    };

    it('Tries to read testing folder structure', async function() {
      try {
        const struct = dirStruc.getStruct(folderA);
        recursiveAssert(struct, expectedStruct);
        // delets testing folders and files
        await fs.unlink(file2, () => null);
        await fs.unlink(file1, () => null);
        await fs.rmdir(folderB, () => null);
        await fs.rmdir(folderA, () => null);
      } catch(e) { throw e; }
    });

    it('Tries to create testing directory structure', async function() {
      try {
        await dirStruc.createStruct(expectedStruct, __dirname);
        const struct = dirStruc.getStruct(folderA);
        recursiveAssert(struct, expectedFolders);
      } catch (e) { throw e; }
    });

    it('Tries to read non-readable folder, should throw', function () {
      assert.throws(() => { dirStruc.getStruct(unreadable); });
    });

    it('Tries to create in a non-readable folder, should throw', function () {
      assert.throws(() => { dirStruc.createStruct(expectedStruct, unreadable); });
    });

    after('Removes sample directory', async function() {
      try {
        // deletes testing directory structure
        await fs.rmdir(folderB, () => null);
        await fs.rmdir(folderA, () => null);
      } catch (e) { console.error(e.stack); }
    });
  });
});
