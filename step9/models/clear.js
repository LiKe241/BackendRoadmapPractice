const config = require('./config');

const con = config.con;
const query = config.query;

/* eslint no-console: "off" */
(async () => {
  try {
    await config.connect();
    console.log('Connected to database');

    await query('DROP DATABASE IF EXISTS bbs');
    console.log('Removed database bbs');

    con.end();
  } catch (e) { return console.error(e.stack); }
})();
