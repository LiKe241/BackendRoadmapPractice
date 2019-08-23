const http = require('http');
const routes = require('./controllers/routes');
const db = require('./models/interface');

/* eslint no-console: "off" */
(async () => {
  await db.connect();
  await db.query('USE bbs');

  http.createServer((req, res) => {
    try {
      console.log('Received request ' + req.url);
      routes.routes(req, res);
    } catch (e) { console.error(e.stack); }
  }).listen(8080);

  console.log('Server listening at http://127.0.0.1:8080');
})();
