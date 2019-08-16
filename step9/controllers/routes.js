const pug = require('pug');
const path = require('path');

exports.routes = (req, res) => {
  try {
    const requestURL = req.url;
    const views = path.resolve(__dirname, '../views/');
    // redirects '/' to '/public'
    if (requestURL === '/') {
      res.writeHead(301, { Location: '/public' });
    // renders '/public.pug'
    } else if (requestURL === '/public') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(pug.renderFile(views + '/public.pug'));
    } else {
      throw new RangeError(requestURL + ' does not exist');
    }
  // writes 404 if error happended
  } catch (e) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    throw e;
  // sends out response
  } finally {
    res.end();
  }
};
