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
    FROM threads AS t JOIN users \
    WHERE parentID = 0 \
    ORDER BY timeEdited \
    LIMIT ? OFFSET ?',
    [numEntries, offset]
  );
};

/*
returns all children of rootID in the format:
{
  title: XXX,
  content: XXX,
  creatorName: XXX,
  timeCreated: XXX,
  timeEdited: XXX,
  responses: [
    {
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
  username AS creatorName, \
  DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
  DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
FROM threads AS t JOIN users \
WHERE parentID = ?';
exports.findChildren = async (rootID) => {
  let parent = await query(
    'SELECT \
      title, \
      content, \
      username AS creatorName, \
      DATE_FORMAT(timeCreated, "%e-%c-%y %T") AS timeCreated, \
      DATE_FORMAT(timeEdited, "%e-%c-%y %T") AS timeEdited \
    FROM threads AS t JOIN users \
    WHERE t.ID = ?',
    [rootID]
  );
  parent = parent[0];
  parent.responses = [];
  const children = await query(sqlFindChildThreads, [rootID]);
  // checks children is not empty
  if (children.length === 0) { return parent; }
  await recursiveFindChildren(children);
  parent.responses = children;
  return parent;
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
