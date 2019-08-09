const assert = require('assert');
const fs = require('fs');

describe('Unit Tests', function() {
  describe('directoryStructure.js Tests', function() {

    before('Creates sample directory to read', function() {
      fs.mkdir(__dirname + '/folderA', (err) => {
        if (err) console.error(err);
      });
    });

    it('Tries to read folderA', function() {
      const stats = fs.lstatSync(__dirname + '/folderA');
      assert.equal(stats.isDirectory(), true);
    });

    after('Removes sample directory', function() {
      fs.rmdir(__dirname + '/folderA', (err) => {
        if (err) console.error(err);
      });
    });
  });
});
