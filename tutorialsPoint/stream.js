// const fs = require('fs');
// const zlib = require('zlib');
// const data = '';

// reads from text.txt
// var readerStream = fs.createReadStream('text.txt');
// readerStream.setEncoding('UTF8');
// readerStream.on('data', (dataBuffer) => {
//   data += dataBuffer;
// });
// readerStream.on('error', (err) => {
//   console.log(err.stack);
// })

// // prepares to write to out.txt
// var writerStream = fs.createWriteStream('out.txt');
// writerStream.on('finish', () => {
//   console.log('Writing Finished');
// });
// writerStream.on('error', (err) => {
//   console.log(err.stack);
// });

// // writes to out.txt when finished reading text.txt
// readerStream.on('end', () => {
//   console.log('Reading Finished');
//   writerStream.write(data, 'UTF8');
//   writerStream.end();
// });

// // redirects contents from text.txt to another.txt
// var anotherOutStream = fs.createWriteStream('another.txt');
// var anotherInStream = fs.createReadStream('text.txt');
// anotherInStream.pipe(anotherOutStream);

// compresses text.txt into text.txt.gz
// fs.createReadStream('text.txt')
//   .pipe(zlib.createGzip())
//   .pipe(fs.createWriteStream('text.txt.gz'));
// console.log('File Compressed');

// decompresses text.txt.gz into dec.text.txt
// fs.createReadStream('text.txt.gz')
//   .pipe(zlib.createGunzip())
//   .pipe(fs.createWriteStream('dec.text.txt'));
// console.log('File Decompressed');

// console.log('Last line of program');
