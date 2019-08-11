const https = require('https');
const fs = require('fs');

let url = 'https://www.reddit.com/r/';

function getPosts(subModule = 'programming', limit = 25) {
  // creates api url to get JSON of latests posts
  url += subModule + '/new/.json?limit=' + limit;
  // initiates a HTTPS GET request
  https.get(url, (res) => {
    let json = '';
    // reading chunks of data into json
    res.on('data', (d) => { json += d; });
    // finished reading all data
    res.on('end', () => {
      // prepares to write to posts.txt
      const outStream = fs.createWriteStream('posts.txt');
      // parses JSON string into JSON object
      const redditResponse = JSON.parse(json);
      // for each potential post
      redditResponse.data.children.forEach((child) => {
        const data = child.data;
        if (data.domain !== 'self.node') {
          const contents = '=============================\n'
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
    });
  // handles error from request
  }).on('error', (err) => {
    console.error(err.stack);
  });
}

getPosts();
