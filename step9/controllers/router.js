const routes = require('./routes');

exports.routes = (req, res) => {
  try {
    if (req.url === '/') {
      res.writeHead(301, { Location: '/public' });
      res.end();
    } else if (req.url === '/public') {
      routes.publicPage(req, res);
    } else if (req.url === '/login') {
      routes.logIn(req, res);
    } else if (req.url === '/register') {
      routes.register(req, res);
    } else if (req.url === '/profile') {
      routes.profile(req, res);
    } else if (req.url === '/newThread') {
      routes.newThread(req, res);
    } else if (req.url === '/logout') {
      routes.logout(res);
    } else if (req.url.includes('/thread?id=')) {
      routes.thread(req, res);
    } else if (req.url.startsWith('/views/') && req.url.endsWith('.js')) {
      routes.serveJS(req, res);
    } else if (req.url === '/response') {
      routes.postResponse(req, res);
    } else if (req.url === '/modification') {
      routes.modify(req, res);
    } else {
      // current request url does not match anything, returns 404 not found
      routes.notFound(req, res);
    }
  } catch (e) {
    throw e;
  }
};
