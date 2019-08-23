const pug = require('pug');
const path = require('path');
const cookie = require('cookie');
const qs = require('querystring');
const db = require('../models/interface');

const views = path.resolve(__dirname, '../views/');

function sendTemplate(response, template) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(pug.renderFile(views + template));
  response.end();
}

function writeSendError(response, err) {
  if (err instanceof RangeError) {
    response.writeHead(404, {'Content-Type': 'text/html'});
  } else if (err instanceof ReferenceError) {
    response.writeHead(501, {'Content-Type': 'text/html'});
  }
  response.write(err.message);
  response.end();
}

exports.routes = (req, res) => {
  try {
    const requestURL = req.url;

    // redirects '/' to '/public'
    if (requestURL === '/') {
      res.writeHead(301, { Location: '/public' });
    // renders '/public.pug'
    } else if (requestURL === '/public') {
      sendTemplate(res, requestURL + '.pug');
    } else if (requestURL === '/login') {
      // renders '/login.pug'
      if (req.method === 'GET') {
        sendTemplate(res, requestURL + '.pug');
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (d) => body += d);
        req.on('end', async () => {
          const form = qs.parse(body);
          try {
            await db.validateUser(form.username, form.password);
          } catch (e) {
            writeSendError(res, e);
          }
        });
      }
    } else {
      throw new RangeError(requestURL + ' does not exist');
    }
  } catch (e) {
    writeSendError(res, e);
    throw e;
  }
};
