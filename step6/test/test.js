const assert = require('assert');

describe('Tests', function () {


  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
      assert.strictEqual([1, 2, 3].indexOf(0), -1);
    });
  });
  describe('double done', function () {
    it('should fail when done() is called twice', function (done) {
      this.skip();
      setImmediate(done);
      setImmediate(done);
    });
  });

  describe('Timeout Tests', function () {
    const timeout = 500;
    const slow = Math.ceil(timeout / 1.9);
    const normal = Math.ceil(slow / 1.9);
    const fast = Math.ceil(normal / 1.9);
    this.timeout(timeout);
    this.slow(slow);

    it(slow + 'ms is slow when slow is ' + slow + 'ms', function(done) {
      setTimeout(done, slow);
    });

    it (normal + 'ms is normal when slow is ' + slow + 'ms', function(done) {
      setTimeout(done, normal);
    });

    it (fast + 'ms is fast when slow is ' + slow + 'ms', function(done) {
      setTimeout(done, fast);
    });
  });
});
