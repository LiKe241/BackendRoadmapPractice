var http = require('http');
var fs = require('fs');
var url = require('url');
var nodemailer = require('nodemailer');
// imports user-defined module
var dt = require('./module');

// configure email functionality
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aiden.li.610@gmail.com',
    pass: 'wwxkGGXB610'
  }
});
var emailContents = {
  from: 'aiden.li.610@gmail.com',
  to: 'rxzrxz233@gmail.com',
  subject: 'Testing nodemailer',
  text: 'Contents sent'
};
// sends email
transporter.sendMail(emailContents, (err, info) => {
  if (err) console.log(err);
  else console.log('Email sent: ' + info.response);
});

http.createServer((req, res) => {
  // parse query url
  let query = url.parse(req.url, true);
  let filename = '.' + query.pathname;

  // reads index.html into {data}
  fs.readFile(filename, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end('404 could not find');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    // calls user-defined module
    res.write("Current date and time is: " + dt.dateTime());
    // appends index.html
    res.write(data);
    return res.end();
  });
}).listen(8080);
