const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD
});

const connect = util.promisify(con.connect).bind(con);
const query = util.promisify(con.query).bind(con);

/* eslint no-console: "off" */
(async () => {
  try {
    await connect;
    console.log('Connected to database');

    // // creates a database named w3s
    // await query('CREATE DATABASE w3s');
    // console.log('Database created');
    
    // // creates a table named customers with three fields
    // const create = 'CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))';
    // await query(create);
    // console.log('Table created');
    
    // // inserts values into customers
    // const insert = 'INSERT INTO customers (name, address) VALUES ?';
    // const values = [
    //   ['John', 'Highway 71'],
    //   ['Peter', 'Lowstreet 4'],
    //   ['Amy', 'Apple st 652'],
    //   ['Hannah', 'Mountain 21'],
    //   ['Michael', 'Valley 345'],
    //   ['Sandy', 'Ocean blvd 2'],
    //   ['Betty', 'Green Grass 1'],
    //   ['Richard', 'Sky st 331'],
    //   ['Susan', 'One way 98'],
    //   ['Vicky', 'Yellow Garden 2'],
    //   ['Ben', 'Park Lane 38'],
    //   ['William', 'Central st 954'],
    //   ['Chuck', 'Main Road 989'],
    //   ['Viola', 'Sideway 1633']
    // ];
    // const insertResult = await query(insert, [values]);
    // console.log('Number of rows inserted: ' + insertResult.affectedRows);
    
    // // retrives all rows in customers
    // const select = 'SELECT name, address FROM customers';
    // const allRows = await query(select);
    // console.log('All results:');
    // console.log(allRows);
    // // return value of SELECT is an array of RowDataPacket(objects)
    // console.log('Address of first row: ' + allRows[0].address);

    // // retrives a specific customer
    // const select = 'SELECT name, address FROM customers WHERE address = \'Park Lane 38\'';
    // const row = await query(select);
    // console.log(row);

    // // retrives a result of search by pattern
    // const select = 'SELECT * FROM customers WHERE address LIKE \'S%\'';
    // const startWithS = await query(select);
    // console.log(startWithS);

    // // sorts rows by descending names
    // const select = 'SELECT * FROM customers ORDER BY name DESC';
    // const descendingNames = await query(select);
    // console.log(descendingNames);

    // // gets 5 rows from all results, starting at the index 2
    // const select = 'SELECT * FROM customers LIMIT 2, 5';
    // console.log(await query(select));

    // // updates values
    // const update = 'UPDATE customers SET address = \'Canyon 123\' WHERE address = \'Valley 345\'';
    // const updateResult = await query(update);
    // console.log('Updated ' + updateResult.affectedRows + ' record(s)');

    // // deletes a row with specific address
    // const deleteCommand = 'DELETE FROM customers WHERE address = \'Mountain 21\'';
    // const deleteResult = await query(deleteCommand);
    // console.log('Number of rows deleted:' + deleteResult.affectedRows);

    // // drops a table named customers
    // const drop = 'DROP TABLE IF EXISTS customers';
    // const dropResult = await query(drop);
    // if (dropResult.warningCount === 1) console.log('customers does not exist');
    // else console.log('Table "customers" deleted');
  } catch (e) {
    console.error(e.stack);
  } finally {
    con.end();
  }
})();
