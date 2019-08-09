var http = require('https');

// configures options of HTTP request
var options = {
  host: 'www.reddit.com',
  path: '/r/programming/',
  method: 'GET'
};

// callback to handle response
var cb = (res) => {
  var body = '';
  console.log(res.statusCode);
  res.on('data', (data) => { console.log('Reading response'); });
  res.on('end', () => { console.log('Finished reading') });
}

// instiantiates a request
var req = http.request(options, cb);
// check socket
// req.on('socket', (socket) => {
//   console.log('Got socket ========');
//   socket.on('data', (data) => {
//     console.log('Reading from socket ' + data);
//   });
//   socket.on('end', () => {
//     console.log('End of socket');
//   });
// });
// handles error
req.on('error', (err) => {
  console.log('error from request');
  console.error(err.stack);
});
// sends the request
req.end();
