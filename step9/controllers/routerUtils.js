const cookie = require('cookie');
const pug = require('pug');
const path = require('path');

// file names of pug templates
const views = path.resolve(__dirname, '../views');
exports.templates = {
  public: views + '/public.pug',
  login: views + '/login.pug',
  register: views + '/register.pug',
  error: views + '/error.pug',
  newThread: views + '/newThread.pug',
  thread: views + '/thread.pug'
};

// renders pug template file and writes into response
exports.sendTemplate = (res, template, options = {}) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(pug.renderFile(template, options));
  res.end();
};

// returns true if cookie.userID is not empty string
exports.isLoggedIn = (req) => req.headers.cookie
  && cookie.parse(req.headers.cookie).userID !== '';

exports.warnNotLogIn = (res) =>
  exports.sendTemplate(res, exports.templates.error, {
    err: {
      code: 403,
      message: 'Not logged in'
    }
  });
