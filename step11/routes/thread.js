const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.route('/new')
  .all((req, res, next) => {
    if (!req.cookies.name) {
      next({ code: 403, message: 'cannot post new thread without logging in'});
    } else {
      next();
    }
  })
  .get((req, res) => res.render('newThread'))
  .post((req, res, next) => {
    const threadInfo = req.body;
    if (!threadInfo.title || !threadInfo.content) {
      next({ code: 403, message: 'missing required info' });
    } else {
      controllers.createThread(threadInfo, res);
    }
  });

// _id in mongoose is hexadecimal string for a 12-byte value
router.route('/:id([a-z\\d]{24})')
  .get((req, res) =>
    controllers.getThread(req.params.id, res)
  )
  .post((req, res, next) => {
    const response = req.body;
    if (!response.content) {
      next({ code: 403, message: 'missing response content' });
    } else if (!req.cookies.name) {
      next({ code: 403, message: 'cannot respond without logging in' });
    } else {
      controllers.postResponse(response, res);
    }
  })
  .delete((req, res, next) => {
    const toDisable = req.body;
    if (!toDisable.ID) {
      next({ code: 403, message: 'missing response content' });
    } else if (!req.cookies.name) {
      next({ code: 403, message: 'cannot delete without logging in' });
    } else {
      controllers.disableResponse(toDisable, res);
    }
  });

router.get('/my', (req, res, next) => {
  if (!req.cookies.name) {
    next({ code: 403, message: 'cannot look up your posts without logging in'});
  } else {
    controllers.getThreadsBy(req.cookies.name, res);
  }
});

module.exports = router;
