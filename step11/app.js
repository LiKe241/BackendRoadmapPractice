const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');

mongoose.connect(
  config.database.url,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = express();

// express configurations
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

// mounts middlewares
app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(express.static('public'))
  .use(routes.indexRouter)
  .use((err, req, res, next) => {
    err.code = err.code ? err.code : 500;
    res.status(err.code);
    res.render('error', { err });
  });

// starts server
app.listen(app.get('port'), () => {
  /* eslint-disable no-console */
  console.log(
    'Express server listening on port ' + app.get('port')
  );
});
