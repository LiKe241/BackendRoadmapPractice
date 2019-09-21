const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

const app = express();

// express configurations
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .user(routes)
  .use((err, req, res, next) => {
    err.code = 500;
    res.render('error', err);
  });
