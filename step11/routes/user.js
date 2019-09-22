const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.route('/register')
  .all((req, res, next) => {
    if (req.cookies.name) {
      next({ code: 403, message: 'cannot register while logged in' });
    } else {
      next();
    }
  })
  .get((req, res) => res.render('register'))
  .post((req, res, next) => {
    const registerInfo = req.body;
    if (!registerInfo.name || !registerInfo.password) {
      next({ code: 403, message: 'missing required info' });
    } else {
      controllers.register(registerInfo, res);
    }
  });

router.route('/login')
  .all((req, res, next) => {
    if (req.cookies.name) {
      next({ code: 403, message: 'cannot login while logged in' });
    } else {
      next();
    }
  })
  .get((req, res) => res.render('login'))
  .post((req, res, next) => {
    const loginInfo = req.body;
    if (!loginInfo.name || !loginInfo.password) {
      next({ code: 403, message: 'missing required info' });
    } else {
      controllers.login(loginInfo, res);
    }
  });

router.route('/logout')
  .all((req, res, next) => {
    if (!req.cookies.name) {
      next({ code: 403, message: 'cannot logout while not logged in'});
    } else {
      next();
    }
  })
  .get((req, res) => {
    res.clearCookie('name');
    res.redirect(301, '..');
  });

module.exports = router;
