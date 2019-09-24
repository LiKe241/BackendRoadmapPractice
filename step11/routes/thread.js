const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.route('/new')
  .all((req, res, next) => {
    if (!req.cookies.name) {
      next({ code: 401, message: 'cannot post new thread without logging in'});
    } else {
      next();
    }
  })
  .get((req, res) => res.render('newThread'))
  .post((req, res, next) => {
    const threadInfo = req.body;
    threadInfo.author = req.cookies.name;
    if (!threadInfo.title || !threadInfo.content) {
      next({ code: 400, message: 'missing required info' });
    } else if (!threadInfo.author) {
      next({ code: 401, message: 'cannot create thread without logging in' });
    } else {
      controllers.createThread(threadInfo, res, next);
    }
  });

// _id in mongoose is hexadecimal string for a 12-byte value
router.route('/:id([a-z\\d]{24})')
  .get((req, res, next) =>
    controllers.getThread(req.params.id, req.cookies.name, res, next)
  )
  .post((req, res, next) => {
    const response = {
      content: req.body.content,
      parentID: req.params.id,
      author: req.cookies.name
    };
    if (!response.content || !response.parentID) {
      next({ code: 400, message: 'missing required info' });
    } else if (!response.author) {
      next({ code: 401, message: 'cannot respond without logging in' });
    } else {
      controllers.postResponse(response, res, next);
    }
  })
  .delete((req, res, next) => {
    const toDisable = { id: req.params.id, author: req.cookies.name };
    if (!toDisable.author) {
      next({ code: 401, message: 'cannot delete without logging in' });
    } else {
      controllers.updateThread(toDisable, 'disabling', res, next);
    }
  })
  .put((req, res, next) => {
    const newContent = {
      id: req.params.id,
      content: req.body.content,
      author: req.cookies.name
    };
    if (!newContent.content) {
      next({ code: 400, message: 'missing new content' });
    } else if (!newContent.author) {
      next({ code: 401, message: 'cannot update without logging in' });
    } else {
      controllers.updateThread(newContent, 'modification', res, next);
    }
  });

router.get('/my', (req, res, next) => {
  if (!req.cookies.name) {
    next({ code: 401, message: 'cannot look up your posts without logging in'});
  } else {
    controllers.getThreadsBy(req.cookies.name, res, next);
  }
});

module.exports = router;
