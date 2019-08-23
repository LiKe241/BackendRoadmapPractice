const assert = require('assert');
const http = require('http');
const util = require('util');
const pug = require('pug');
const path = require('path');

const routes = require('../../controllers/routes');
/* eslint no-console: "off" */
describe('Router Unit Tests', function () {
  const options = {
    host: 'localhost',
    port: '8080',
    method: 'GET'
  };
  let views;
  let server;

  before('Starts HTTP server', function() {
    views = path.resolve(__dirname, '../../views/');
    server = http.createServer((req, res) => {
      try {
        routes.routes(req, res);
      // catches 'RangeError: requestURL does not exist' and does nothing
      } catch (e) { (() => null)(); }
    }).listen(8080);
  });

  it('Request to /', function (done) {
    options.path = '/';

    http.get(options, (res) => {
      // asserts response status code is 301 redirect
      assert.strictEqual(res.statusCode, 301, 'Status code is not 301');
      // asserts location of redirection is /public
      assert.strictEqual(res.headers.location, '/public', 'location of redirection is not /public');
      done();
    });
  });

  it('Routes to /public', function(done) {
    options.path = '/public';
    const expected = pug.renderFile(views + '/public.pug');

    http.get(options, (res) => {
      let response = '';
      res.on('data', (d) => response += d);
      res.on('end', () => {
        // asserts body of response is rendered public.pug
        assert.strictEqual(response, expected, 'body of response is not rendered public.pug');
        done();
      });
    });
  });

  it('Routes to /non-existing', function(done) {
    options.path = '/non-existing';

    http.get(options, (res) => {
      // asserts status code is 404 not found
      assert.strictEqual(res.statusCode, 404, 'Status code is not 404');
      done();
    });
  });

  after('Shuts down HTTP server', function() {
    server.close();
  });
});
