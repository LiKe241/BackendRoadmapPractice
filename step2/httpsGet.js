var https = require('https');
var fs = require('fs');

var url = 'https://www.reddit.com/r/';

function getPosts(subModule = 'programming', limit = 25) {
  // creates api url to get JSON of latests posts
  url += subModule + '/new/.json?limit=' + limit;
  // initiates a HTTPS GET request
  https.get(url, (res) => {
    var json = '';
    // reading chunks of data into json
    res.on('data', (d) => { json += d; });
    // finished reading all data
    res.on('end', () => {
      // prepares to write to posts.txt
      var outStream = fs.createWriteStream('posts.txt');
      // parses JSON string into JSON object
      redditResponse = JSON.parse(json);
      // for each potential post
      redditResponse.data.children.forEach((child) => {
        let data = child.data;
        if (data.domain != 'self.node') {
          let contents = '=============================\n'
                       + 'Author: ' + data.author + '\n'
                       + 'Doman: ' + data.doman + '\n'
                       + 'Title: ' + data.title + '\n'
                       + 'URL: ' + data.url + '\n';
          // writes to posts.txt
          outStream.write(contents);
        }
      });
      // closes writeStream
      outStream.end();
    })
  // handles error from request
  }).on('error', (err) => {
    console.error(err.stack);
  });
}

getPosts();
