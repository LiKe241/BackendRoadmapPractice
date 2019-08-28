const cookie = require('cookie');
const qs = require('querystring');
const db = require('../models/interface');
const ru = require('./routerUtils');

exports.notFound = (req, res) => {
  const err = new RangeError(req.url + ' does not exist');
  err.code = 404;
  ru.sendTemplate(res, ru.templates.error, {err});
};

exports.logIn = (req, res) => {
  // reached via a link, asks user to submit registered info
  if (req.method === 'GET') {
    ru.sendTemplate(res, ru.templates.login);
  // reached via submitting username and password
  } else if (req.method === 'POST') {
    let form = '';
    req.on('data', (d) => form += d);
    req.on('end', async () => {
      form = qs.parse(form);
      try {
        await db.validateUser(form.username, form.password);
        // user was validated, set cookie
        res.setHeader('Set-Cookie', cookie.serialize(
          'userID',
          await db.getUserID(form.username),
          { httpOnly: true })
        );
        res.writeHead(301, { Location: '/public' });
        res.end();
      } catch (e) {
        e.code = 400;
        ru.sendTemplate(res, ru.templates.error, { err: e });
      }
    });
  }
};

exports.register = (req, res) => {
  // reached via a link, asks user to submit registering info
  if (req.method === 'GET') {
    ru.sendTemplate(res, ru.templates.register);
  // reached via submitting registering info
  } else if (req.method === 'POST') {
    let form = '';
    req.on('data', (d) => form += d);
    req.on('end', async () => {
      form = qs.parse(form);
      try {
        // sanity check for submitted passwords
        if (form.password !== form.repeatPassword) {
          throw new RangeError('Two passwords do not match');
        }
        await db.createUser(form.username, form.password);
        // user was created, set cookie
        res.setHeader('Set-Cookie', cookie.serialize(
          'userID',
          await db.getUserID(form.username),
          { httpOnly: true })
        );
        res.writeHead(301, { Location: '/public' });
        res.end();
      } catch (e) {
        e.code = 400;
        ru.sendTemplate(res, ru.templates.error, { err: e });
      }
    });
  }
};

exports.profile = (req, res) => {
  // TODO: displays all posts and responds by current user
  res();
  return req;
};


// TODO
exports.newThread = (req, res) => {
  if (ru.isLoggedIn(req, res)) {
    // reached via a link, asks user to submit registering info
    if (req.method === 'GET') {
      ru.sendTemplate(res, ru.templates.newThread);
    // reached via submitting registering info
    } else if (req.method === 'POST') {
      return null;
    }
  } else {
    ru.warnNotLogIn(res);
  }
};

exports.publicPage = async (req, res) => {
  // user had logged in
  if (ru.isLoggedIn(req, res)) {
    try {
      // throws RangeError if could not find userID in database
      const username = await db.getUserName(
        cookie.parse(req.headers.cookie).userID
      );
      ru.sendTemplate(res, ru.templates.public, { username });
    } catch (err) {
      err.code = 500;
      err.message = 'Cache is contaminated';
      ru.sendTemplate(res, ru.templates.error, { err });
    }
  } else {
    ru.sendTemplate(res, ru.templates.public);
  }
};


exports.logout = (res) => {
  res.setHeader('Set-Cookie', cookie.serialize(
    'userID', '', { httpOnly: true })
  );
  res.writeHead(301, { Location: '/public' });
  res.end();
};
