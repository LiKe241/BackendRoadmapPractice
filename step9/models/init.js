const config = require('./config');

const con = config.con;
const query = config.query;

/* eslint no-console: "off" */
(async () => {
  try {
    await config.connect();
    console.log('Connected to database');

    await query('CREATE DATABASE IF NOT EXISTS bbs');
    console.log('Checked existence of database bbs');

    await query('USE bbs');
    console.log('Switched to database bbs');

    await query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(15), passwordHash CHAR(60))');
    console.log('Checked existence of table users');

    await query('CREATE TABLE IF NOT EXISTS threads (id INT AUTO_INCREMENT PRIMARY KEY, creatorId INT, timeCreated DATETIME, timeEdited TIMESTAMP, title VARCHAR(127), content TEXT)');
    console.log('Checked existence of table threads');

    await query('CREATE TABLE IF NOT EXISTS responds (id INT AUTO_INCREMENT PRIMARY KEY, parentPostId INT, creatorId INT, timeCreated DATETIME, timeEdited TIMESTAMP, content TEXT)');
    console.log('Checked existence of table responds');

    con.end();
  } catch (e) { return console.error(e.stack); }
})();
