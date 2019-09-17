const cookie = require('cookie');
const qs = require('querystring');
const db = require('../models/interface');
const ru = require('./routerUtils');
const fs = require('fs');
const path = require('path');

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
      } catch (err) {
        err.code = 400;
        ru.sendTemplate(res, ru.templates.error, { err });
      }
    });
  }
};

exports.profile = (req, res) => {
  // TODO: displays all posts and responds by current user
  res();
  return req;
};

exports.newThread = (req, res) => {
  if (!ru.isLoggedIn(req, res)) {
    ru.warnNotLogIn(res);
  }
  // reached via a link, asks user to submit thread contents
  if (req.method === 'GET') {
    ru.sendTemplate(res, ru.templates.newThread);
  // reached via submitting thread contents
  } else if (req.method === 'POST') {
    let form = '';
    req.on('data', (d) => form += d);
    req.on('end', async () => {
      try {
        form = qs.parse(form);
        await db.createThread(
          form.title,
          form.content,
          cookie.parse(req.headers.cookie).userID
        );
        res.writeHead(301, { Location: '/public' });
        res.end();
      } catch (err) {
        err.code = 500;
        ru.sendTemplate(res, ru.templates.error, { err });
      }
    });
  }
};

exports.publicPage = async (req, res) => {
  try {
    // username = '' if not logged in, username otherwise
    const username = ru.isLoggedIn(req, res)
      ? await db.getUserName(
        cookie.parse(req.headers.cookie).userID
      )
      : '';
    // gets latest 1-10 threads
    const threads = await db.getLatest(1, 10);
    ru.sendTemplate(res, ru.templates.public, { username, threads });
  } catch (err) {
    err.code = 500;
    ru.sendTemplate(res, ru.templates.error, { err });
  }
};

exports.logout = (res) => {
  res.setHeader('Set-Cookie', cookie.serialize(
    'userID', '', { httpOnly: true })
  );
  res.writeHead(301, { Location: '/public' });
  res.end();
};

exports.thread = async (req, res) => {
  try {
    const id = new URL('http:/' + req.url).searchParams.get('id');
    const threadInfo = await db.findChildren(id);
    const userID =
      ru.isLoggedIn(req, res)
      && cookie.parse(req.headers.cookie).userID;
    ru.sendTemplate(res, ru.templates.thread, {
      threadInfo,
      userID
    });
  } catch (err) {
    err.code = 500;
    ru.sendTemplate(res, ru.templates.error, { err });
  }
};

exports.serveJS = (req, res) => {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, '..', req.url.substr(1)));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(file);
  } catch (err) {
    err.code = 500;
    ru.sendTemplate(res, ru.templates.error, { err });
  }
};

exports.postResponse = async (req, res) => {
  let form = '';
  req.on('data', (d) => form += d);
  req.on('end', async () => {
    try {
      form = qs.parse(form);
      await db.postResponse(
        form.content,
        form.toUpdateID,
        cookie.parse(req.headers.cookie).userID
      );
      res.writeHead(301, { Location: '/thread?id=' + form.threadID });
      res.end();
    } catch (err) {
      err.code = 500;
      ru.sendTemplate(res, ru.templates.error, { err });
    }
  });
};

exports.modify = async (req, res) => {
  let form = '';
  req.on('data', d => form += d);
  req.on('end', async () => {
    try {
      form = qs.parse(form);
      await db.modifyThread(form.content, form.toUpdateID);
      res.writeHead(301, { Location: '/thread?id=' + form.threadID });
      res.end();
    } catch (err) {
      err.code = 500;
      ru.sendTemplate(res, ru.templates.error, { err });
    }
  });
};
