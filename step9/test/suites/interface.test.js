const assert = require('assert');
const util = require('util');
const bcrypt = require('bcrypt');

const dbInterface = require('../../models/interface');
const dbConfig = require('../../models/config');

const testUserName = 'octopus';
const testPassword = '123456';
const randomPassword = 'q135gqe';
const saltRounds = 5;

describe('DB Interface Unit Tests', function () {
  let query;
  let con;
  before('Creates testing database', async function () {
    // connects to mysql server, creates a test database and tables
    dbConfig.connect();
    con = dbConfig.con;
    query = dbConfig.query;
    await query('CREATE DATABASE IF NOT EXISTS testing');
    await query('USE testing');
    await query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(15), passwordHash CHAR(60))');
    await query('CREATE TABLE IF NOT EXISTS threads (id INT AUTO_INCREMENT PRIMARY KEY, creatorId INT, timeCreated DATETIME, timeEdited TIMESTAMP, title VARCHAR(127), content TEXT)');
    await query('CREATE TABLE IF NOT EXISTS responds (id INT AUTO_INCREMENT PRIMARY KEY, parentPostId INT, creatorId INT, timeCreated DATETIME, timeEdited TIMESTAMP, content TEXT)');
  });

  describe('createUser() Unit Tests', function () {
    it('Error test, creating an existing user', async function () {
      // directly inserts a test user
      const hash = await util.promisify(bcrypt.hash).bind(bcrypt)(testPassword, saltRounds);
      await query('INSERT INTO users (name, passwordHash) VALUES (?)', [[testUserName, hash]]);
      // asserts createUser to throw a RangeError (reject)
      await assert.rejects(
        async () => await dbInterface.createUser(testUserName, testPassword),
        {
          name: 'RangeError',
          message: 'user exists'
        },
        'Failed to detect an existing user'
      );
      // directly cleans up the test user
      await query('DELETE FROM users WHERE name = ?', [testUserName]);
    });

    it('Creating a new user', async function () {
      // uses createUser to insert a test user
      await dbInterface.createUser(testUserName, testPassword);
      // directly finds the user, asserts it to exist
      const newRow = await query('SELECT * FROM users WHERE name = ?', [testUserName]);
      assert.strictEqual(newRow.length, 1, 'Failed to insert the new user');
      // directly cleans up the test user
      await query('DELETE FROM users WHERE name = ?', [testUserName]);
    });
  });

  describe('validateUser() Unit Tests', function () {
    it ('Error test, validating a non-existing user', async function () {
      // asserts validateUser to throw a RangeError (reject)
      await assert.rejects(
        async () => await dbInterface.validateUser(testUserName, testPassword),
        {
          name: 'RangeError',
          message: 'user does not exist'
        },
        'Failed to detect a non-existing user'
      );
    });

    it ('Validating existing passwords', async function () {
      // directly inserts a test user
      const hash = await util.promisify(bcrypt.hash).bind(bcrypt)(testPassword, saltRounds);
      await query('INSERT INTO users (name, passwordHash) VALUES (?)', [[testUserName, hash]]);
      // validates a valid password
      let isValid = await dbInterface.validateUser(testUserName, testPassword);
      assert.strictEqual(isValid, true, 'Failed to validate a valid password');
      // validates an invalid password
      isValid = await dbInterface.validateUser(testUserName, randomPassword);
      assert.strictEqual(isValid, false, 'Failed to validate an invalid password');
    });
  });

  after('Deletes testing database', async function () {
    // removes testing database
    await query('DROP DATABASE IF EXISTS testing');
    con.end();
  });
});
