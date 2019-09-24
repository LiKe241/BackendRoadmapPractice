const threadModel = require('../models').Threads;

exports.getMain = async (username, res, next) => {
  const threads = await threadModel.find({ parentID: '' });
  threads.sort((a, b) => b.timeUpdated - a.timeUpdated);
  res.render('main', { username, threads });
};

// threadInfo = { title, content, author }
exports.createThread = (threadInfo, res, next) => {
  const newThread = new threadModel(threadInfo);
  newThread.save();
  res.redirect(301, '/main');
};

/*
threadInfo = {
  title, author, id, enabled, content, timeCreated, timeEdited,
  responses: [
    { author, id, enabled, content, timeCreated, timeEdited, responses: [...] },
    {...}, ...
  ]
}
*/
exports.getThread = async (id, user, res, next) => {
  const parent = await threadModel.find({ _id: id });
  if (parent.length === 0) {
    next({ code: 400, message: 'thread ' + id + ' does not exist' });
  }
  await recursiveFindChildren(parent);
  res.render('thread', { threadInfo: parent[0], username: user });
};

async function recursiveFindChildren(parents) {
  for (const parent of parents) {
    const children = await threadModel.find({ parentID: parent.id });
    if (children.length !== 0) {
      await recursiveFindChildren(children);
      parent.responses = children;
    }
  }
}

// response = { content, parentID, author }
exports.postResponse = async (response, res, next) => {
  const responseDocument = new threadModel(response);
  responseDocument.save();
  const rootID = updateRootThread(responseDocument.id);
  res.redirect(301, rootID);
};

// toDisable = { id, author }
exports.disableThread = async (toDisable, res, next) => {
  const toDisableDocument = await threadModel.findOne({
    _id: toDisable.id,
    author: toDisable.author
  });
  if (!toDisableDocument) {
    next({
      code: 401,
      message: 'current user is not the author or cannot find thread'
    });
  } else {
    toDisableDocument.enabled = false;
    toDisableDocument.timeEdited = Date.now();
    toDisableDocument.save();
    updateRootThread(toDisableDocument.id);
    res.status(200);
    res.send();
  }
};

async function updateRootThread(id) {
  let rootThread = await threadModel.findOne({ _id: id });
  while (rootThread.parentID !== '') {
    rootThread = await threadModel.findOne({ _id: rootThread.parentID });
  }
  rootThread.timeUpdated = Date.now();
  rootThread.save();
  return rootThread.id;
}

// newContent = { id, content, author }
exports.updateThread = (newContent, res, next) => {
  next({ code: 501, message: 'updateThread not implemented yet'});
};

exports.getThreadsBy = (username, res, next) => {
  next({ code: 501, message: 'getThreadsBy not implemented yet'});
};
