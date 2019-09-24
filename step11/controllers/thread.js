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
  const rootID = await updateRootThreadOf(responseDocument.id);
  res.redirect(301, rootID);
};

async function updateRootThreadOf(id) {
  const rootThread = await findRootThreadOf(id);
  rootThread.timeUpdated = Date.now();
  rootThread.save();
  return rootThread.id;
}

// toUpdate = { id, author (, content) }, action = 'modification'/'disabling'
exports.updateThread = async (toUpdate, action, res, next) => {
  const toUpdateDocument = await threadModel.findOne({
    _id: toUpdate.id,
    author: toUpdate.author
  });
  if (!toUpdateDocument) {
    next({
      code: 401,
      message: 'current user is not the author or cannot find thread'
    });
  } else {
    if (action === 'modification') {
      toUpdateDocument.content = toUpdate.content;
    } else if (action === 'disabling') {
      toUpdateDocument.enabled = false;
    } else {
      next({ code: 500, message: 'unrecognized action for updateThread()' });
    }
    toUpdateDocument.timeEdited = Date.now();
    toUpdateDocument.save();
    updateRootThreadOf(toUpdateDocument.id);
    res.status(200);
    res.send();
  }
};

exports.getThreadsBy = async (username, res, next) => {
  const posts = await threadModel.find({ author: username });
  const postsInfo = [];
  for (let post of posts) {
    if (post.title === '') {
      const root = await findRootThreadOf(post.id);
      root.response = post;
      post = root;
    }
    postsInfo.push(post);
  }
  res.render('my', { postsInfo });
};

async function findRootThreadOf(id) {
  let rootThread = await threadModel.findOne({ _id: id });
  while (rootThread.parentID !== '') {
    rootThread = await threadModel.findOne({ _id: rootThread.parentID });
  }
  return rootThread;
}
