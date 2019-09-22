const threadModel = require('../models').Threads;

exports.getPublic = async (username, res, next) => {
  const threads = await threadModel.find({ parentID: '' });
  threads.sort((a, b) => b.timeUpdated - a.timeUpdated);
  res.render('public', { username, threads });
};

// threadInfo = { title, content, author }
exports.createThread = (threadInfo, res, next) => {
  const newThread = new threadModel(threadInfo);
  newThread.save();
  res.redirect(301, '/public');
};

exports.getThread = (id, res, next) => {
  next({ code: 501, message: 'getThread not implemented yet' });
};

// response = { content, parentID, author }
exports.postResponse = (response, res, next) => {
  next({ code: 501, message: 'postResponse not implemented yet' });
};

// toDisable = { id, author }
exports.disableThread = (toDisable, res, next) => {
  next({ code: 501, message: 'disableThread not implemented yet' });
};

// newContent = { id, content, author }
exports.updateThread = (newContent, res, next) => {
  next({ code: 501, message: 'updateThread not implemented yet'});
};
