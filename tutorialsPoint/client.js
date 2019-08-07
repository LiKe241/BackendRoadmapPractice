var http = require('http');

// configures options of HTTP request
var options = {
  host: 'localhost',
  port: '8080',
  path: '/home.html'
};

// callback to handle response
var cb = (res) => {
  var body = '';
  res.on('data', (data) => { body += data; });
  res.on('end', () => { console.log(body); });
}

// instiantiates a request
var req = http.request(options, cb);
req.end();
