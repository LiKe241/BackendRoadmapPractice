var fs = require('fs');
var fileName = 'text.txt';
var buf = new Buffer(1024);

// Asynchronous read
console.log('Before calling fs.readFile()');
fs.readFile(fileName, (err, data) => {
  if (err) return console.error(err.stack);
  console.log('Asychronous readFile: ' + data);
});

// Synchronous read
var data = fs.readFileSync(fileName);
console.log('Synchronous readFile: ' + data);

// Asynchronous open
console.log('Before calling fs.open()');
fs.open(fileName, 'r+', (err, fd) => {
  if (err) return console.error(err.stack);
  console.log('Opened file');

  // read file using fs.read()
  console.log('Before calling fs.read()');
  fs.read(fd, buf, 0, buf.length, 0, (err, bytesRead) => {
    if (err) return console.error(err.stack);
    console.log(bytesRead + ' bytes read');
    // only prints read bytes to avoid gibberish
    if (bytesRead > 0) console.log(buf.slice(0, bytesRead).toString());
  });

  // close opened file
  fs.close(fd, (err) => {
    if (err) return console.error(err.stack);
    console.log('File opened by fs.open() was closed');
  });
});

// file status
console.log('Before calling fs.stat()');
fs.stat(fileName, (err, stats) => {
  if (err) return console.error(err.stack);
  console.log(stats);
  console.log('Finished getting file status');
  // checks file type
  if (stats.isFile()) console.log(fileName + ' is a file');
  if (stats.isDirectory()) console.log(fileName + ' is a directory');
});

// deletes a file
var toDelete = 'text.txt.gz';
console.log('Before calling fs.unlink() on ' + toDelete);
fs.unlink(toDelete, (err) => {
  if (err) return console.error(err.stack);
  console.log('Deleted ' + toDelete);
});

// creates directory
var newDir = __dirname + '/newDir';
console.log('Before calling fs.mkdir() on ' + newDir);
fs.mkdir(newDir, (err) => {
  if (err) return console.error(err.stack);
  console.log('Created ' + newDir);
});

// reads directory
var currDir = __dirname;
console.log('Before calling fs.readdir on ' + currDir);
fs.readdir(currDir, (err, files) => {
  if (err) return console.error(err.stack);
  files.forEach((file, index, files) => {
    console.log('File number ' + index + ' is ' + file);
  });

  // removes directory
  var toRemoveDir = newDir;
  console.log('Before calling fs.rmdir() on ' + toRemoveDir);
  fs.rmdir(toRemoveDir, (err) => {
    if (err) return console.error(err.stack);
    console.log('Removed ' + toRemoveDir);
    console.log('Read current dir again to ensure deletion');
    fs.readdir(currDir, (err, files) => {
      if (err) return console.error(err.stack);
      files.forEach((file, index, files) => {
        console.log('File number ' + index + ' is ' + file);
      });
    });
  });
});


console.log('Last line of program');
