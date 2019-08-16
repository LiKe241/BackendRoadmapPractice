var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((req, res) => {
  // gets the pathname in the url of the request
  var pathname = url.parse(req.url).pathname;

  console.log('Request for ' + pathname.substr(1) + ' received.');

  // reads requested file from file system
  fs.readFile(pathname.substr(1), (err, data) => {
    if (err) {
      console.error(err.stack);
      res.writeHead(404, {'Content-Type': 'text/html'});
    } else {
      // found page
      res.writeHead(200, {'Content-Type': 'text/html'});
      // writes data into response
      res.write(data.toString());
    }
    // sends response
    res.end();
  });
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
