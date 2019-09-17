const bcrypt = require('bcrypt');
const util = require('util');
const config = require('./config');

const saltRounds = 5;
const con = config.con;
const query = config.query;

exports.connect = config.connect;
exports.end = con.end;
exports.query = config.query;
exports.createUser = async (name, password) => {
  const rows = await query('SELECT * FROM users WHERE username = ?', [name]);
  if (rows.length >= 1) {
    throw new RangeError('user exists');
  }
  const hash = await util.promisify(bcrypt.hash).bind(bcrypt)(password, saltRounds);
  const values = [[name, hash]];
  await query('INSERT INTO users (username, passwordHash) VALUES ?', [values]);
};

exports.validateUser = async (name, password) => {
  const rows = await query('SELECT * FROM users WHERE username = ?', [name]);
  if (rows.length === 0) {
    throw new RangeError('user does not exist');
  }
  const hash = rows[0].passwordHash;
  return await util.promisify(bcrypt.compare).bind(bcrypt)(password, hash);
};

exports.getUserID = async (name) => {
  const rows = await query('SELECT * FROM users WHERE username = ?', [name]);
  if (rows.length === 0) {
    throw new RangeError('user does not exist');
  }
  return rows[0].ID;
};

exports.getUserName = async (id) => {
  const rows = await query('SELECT * FROM users WHERE ID = ?', [id]);
  if (rows.length === 0) {
    throw new RangeError('id does not exist');
  }
  return rows[0].username;
};

exports.createThread = async (title, content, creatorID) => {
  await query(
    'INSERT INTO threads (title, content, FK_creatorID) \
    SELECT ?, ?, ID FROM users WHERE ID = ?',
    [title, content, creatorID]);
};

/*
returns information about latest [start:end](inclusive) entries in the format:
[
  {threadID: XXX, creatorName: XXX, title: XXX, timeCreated: XXX, timeEdited:XXX},
  {...}, {...}, ...
]
*/
exports.getLatest = async (start, end) => {
  if (start > end || start < 1) {
    throw new RangeError('start and end are not in acceptable range');
  }
  const numEntries = end - start + 1;
  const offset = start - 1;
  return await query(
    'SELECT \
      t.ID AS threadID, \
      username AS creatorName, \
      title, \
      DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
      DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
    FROM threads AS t JOIN users AS u ON t.FK_creatorID = u.ID \
    WHERE parentID = 0 \
    ORDER BY timeEdited \
    LIMIT ? OFFSET ?',
    [numEntries, offset]
  );
};

/*
returns all children of rootID in the format:
{
  id: XXX,
  title: XXX,
  content: XXX,
  creatorName: XXX,
  timeCreated: XXX,
  timeEdited: XXX,
  responses: [
    {
      id: XXX,
      content: XXX,
      creatorName: XXX,
      timeCreated: XXX,
      timeEdited: XXX,
      responses: [...]
    }, {...}, {...}, ...
  ]
}
*/
const sqlFindChildThreads =
'SELECT \
  t.ID AS id, \
  content, \
  FK_creatorID AS creatorID, \
  username AS creatorName, \
  DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
  DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
FROM threads AS t JOIN users AS u ON t.FK_creatorID = u.ID \
WHERE parentID = ?';
exports.findChildren = async (rootID) => {
  const parent = await query(
    'SELECT \
      t.ID AS id, \
      title, \
      content, \
      FK_creatorID AS creatorID, \
      username AS creatorName, \
      DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
      DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
    FROM threads AS t JOIN users AS u ON t.FK_creatorID = u.ID \
    WHERE t.ID = ?',
    [rootID]
  );
  // could not find thread with given id, returns empty array
  if (parent.length === 0) {
    return parent;
  }
  await recursiveFindChildren(parent);
  return parent[0];
};

async function recursiveFindChildren(parents) {
  for (const parent of parents) {
    const children = await query(sqlFindChildThreads, parent.id);
    if (children.length !== 0) {
      await recursiveFindChildren(children);
      parent.responses = children;
    }
  }
}

exports.postResponse = async (content, toUpdateID, userID) => {
  await query(
    'INSERT INTO threads (content, parentID, FK_creatorID) \
    SELECT ?, ?, ID FROM users WHERE ID = ?',
    [content, toUpdateID, userID]
  );
};

exports.modifyThread = async (content, toUpdateID) => {
  await query(
    'UPDATE threads SET content = ? WHERE ID = ?',
    [content, toUpdateID]
  );
};

exports.delete = async (threadID, userID) => {
  const parent = await query(
    'SELECT ID AS id FROM threads WHERE ID = ? AND FK_creatorID = ?',
    [threadID, userID]
  );
  if (parent.length === 0) {
    throw new RangeError;
  }
  const indices = [];
  await recursiveFindChildren(parent);
  // uses DFS to recursively get all indices of deleting threads
  parent.forEach(function recurFindIdx(thread) {
    indices.push(thread.id);
    if (thread.responses) {
      thread.responses.forEach(recurFindIdx);
    }
  });
  await query('DELETE FROM threads WHERE ID IN (?)', [indices]);
};

/*
returns [
  // post created by userID
  {
    threadID: foo,
    title: foo,
    content: foo,
    timeCreated: foo,
    timeEdited: foo
  },
  // responses to other threads
  {
    threadID:foo,
    title:foo,
    creatorName:foo,
    timeCreated: foo,
    timeEdited: foo,
    response: {content:foo, timeCreated:foo, timeEdited:foo}
  }, ...
]
*/
exports.findPostsBy = async (userID) => {
  const posts = await query(
    'SELECT \
      ID AS threadID, \
      title, \
      content, \
      DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
      DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
    FROM threads WHERE FK_creatorID = ? \
    ORDER BY timeEdited DESC',
    [userID]
  );
  const postsInfo = [];
  for (const post of posts) {
    if (post.title === null) {
      // post is a response, appends its root thread
      const parent = await findRoot(post.threadID);
      parent.response = post;
      delete post.title;
      delete post.threadID;
      postsInfo.push(parent);
    } else {
      // post is a root thread, appends itself
      postsInfo.push(post);
    }
  }
  return postsInfo;
};

/*
returns the root thread of given id as
{
  threadID: foo,
  title: foo,
  creatorName: foo,
  timeCreated: foo,
  timeEdited: foo
}
*/
async function findRoot(id) {
  let parent;
  do {
    parent = (await query(
      'SELECT \
        t.ID AS threadID, \
        title, \
        u.username AS creatorName, \
        DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
        DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited, \
        parentID \
      FROM threads AS t JOIN users AS u ON t.FK_creatorID = u.ID \
      WHERE t.ID = ?',
      [id]
    ))[0];
    id = parent.parentID;
  } while (parent.parentID !== 0);
  delete parent.parentID;
  return parent;
}
