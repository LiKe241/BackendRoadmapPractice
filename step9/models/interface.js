const bcrypt = require('bcrypt');
const util = require('util');
const config = require('./config');

const saltRounds = 5;
const con = config.con;
const query = config.query;

exports.connect = config.connect;
exports.end = con.end;
exports.createUser = async (name, password) => {
  const rows = await query('SELECT * FROM users WHERE name = ?', [name]);
  if (rows) {
    throw new Error('user exists');
  }
  const hash = await util.promisify(bcrypt.hash).bind(bcrypt)(password, saltRounds);
  await query('INSERT INTO users (name, passwordHash) VALUES ?, ?', [name], [hash]);
};
