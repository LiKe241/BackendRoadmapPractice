const routes = require('./routes');

exports.routes = (req, res) => {
  try {
    // redirects '/' to '/public'
    if (req.url === '/') {
      res.writeHead(301, { Location: '/public' });
      res.end();
    // renders '/public.pug'
    } else if (req.url === '/public') {
      routes.publicPage(req, res);
    } else if (req.url === '/login') {
      routes.logIn(req, res);
    // renders 'register.pug'
    } else if (req.url === '/register') {
      routes.register(req, res);
    } else if (req.url === '/profile') {
      routes.profile(req, res);
    } else if (req.url === '/newThread') {
      routes.newThread(req, res);
    } else if (req.url === '/logout') {
      routes.logout(res);
    // current request url does not match anything
    } else {
      routes.notFound(req, res);
    }
  } catch (e) {
    throw e;
  }
};
