const config = require('./config');

const con = config.con;
const query = config.query;

/* eslint no-console: "off" */
(async () => {
  try {
    await config.connect();
    console.log('Connected to database');

    await query('DROP DATABASE IF EXISTS bbs');
    await query('CREATE DATABASE IF NOT EXISTS bbs');
    console.log('Checked existence of database bbs');

    await query('USE bbs');
    console.log('Switched to database bbs');

    await query('CREATE TABLE IF NOT EXISTS users ( \
      ID INT AUTO_INCREMENT PRIMARY KEY, \
      username VARCHAR(15), \
      passwordHash CHAR(60))');
    console.log('Checked existence of table users');

    await query('CREATE TABLE IF NOT EXISTS threads ( \
      ID INT AUTO_INCREMENT PRIMARY KEY, \
      FK_creatorID INT, \
      FOREIGN KEY (FK_creatorID) REFERENCES users(ID), \
      parentID INT DEFAULT 0, \
      timeCreated DATETIME DEFAULT CURRENT_TIMESTAMP, \
      timeEdited TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \
      title VARCHAR(127), \
      content TEXT)');
    console.log('Checked existence of table threads');

    con.end();
  } catch (e) { return console.error(e.stack); }
})();
