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
  const rows = await query('SELECT * FROM users WHERE name = ?', [name]);
  if (rows.length >= 1) {
    throw new RangeError('user exists');
  }
  const hash = await util.promisify(bcrypt.hash).bind(bcrypt)(password, saltRounds);
  const values = [[name, hash]];
  await query('INSERT INTO users (name, passwordHash) VALUES ?', [values]);
};

exports.validateUser = async (name, password) => {
  const rows = await query('SELECT * FROM users WHERE name = ?', [name]);
  if (rows.length === 0) {
    throw new RangeError('user does not exist');
  }
  const hash = rows[0].passwordHash;
  return await util.promisify(bcrypt.compare).bind(bcrypt)(password, hash);
};

exports.getUserID = async (name) => {
  const rows = await query('SELECT * FROM users WHERE name = ?', [name]);
  if (rows.length === 0) {
    throw new RangeError('user does not exist');
  }
  return rows[0].id;
};

exports.getUserName = async (id) => {
  const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new RangeError('id does not exist');
  }
  return rows[0].name;
};
