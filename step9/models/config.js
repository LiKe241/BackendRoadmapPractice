const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD
});

exports.con = con;
exports.connect = async () => {
  if (!process.env.MYSQL_PASSWORD) {
    throw new Error('MYSQL_PASSWORD not set');
  }
  await util.promisify(con.connect).bind(con)();
};
exports.query = util.promisify(con.query).bind(con);
