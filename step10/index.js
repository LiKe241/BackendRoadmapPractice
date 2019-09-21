const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const things = require('./things.js');
const movies = require('./movies.js');
const upload = multer();
const app = express();


/* eslint-disable no-console, no-unused-vars */

// assigns middleware to parse application/json
app.use(bodyParser.json());
// assigns middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// assigns middleware to parse multipart/form-data
app.use(upload.array());
// assigns middleware to parse cookie
app.use(cookieParser());
// assigns sessions
app.use(session({ secret: 'required to sign session ID cookie' }));

// error handling
app.get('/error', (req, res, next) => {
  const err = new Error('error created at GET /error');
  next(err);
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send('error happend');
});

// REST API design
app.use('/movies', movies);

// counts number of visits through session
app.get('/session', (req, res) => {
  if (req.session.numViews) {
    res.send(
      'You\'ve visited this page ' + (++req.session.numViews) + ' times'
    );
  } else {
    req.session.numViews = 1;
    res.send('first time in this page');
  }
});

// sets cookie name = express that expires in 360,000 ms
app.get('/cookie', (req, res) => {
  console.log('cookies: ', req.cookies);
  res.cookie('name', 'express', { maxAge: 360000 }).send('cookie set');
});
// clears cookie name
app.get('/clear_cookie_name', (req, res) => {
  res.clearCookie('name');
  res.send('cookie name cleared');
});

// connects to a mongoDB named myDB at localhost
mongoose.connect('mongodb://localhost/myDB');

// creates a new Model named Person
const personSchema = mongoose.Schema({
  name: String,
  age: Number,
  nationality: String
});
const Person = mongoose.model('Person', personSchema);

// asks user to input informatoin about person
app.get('/person', (req, res) => {
  res.render('person');
});
// saves information about person into database
app.post('/person', (req, res) => {
  const personInfo = req.body;
  if (!personInfo.name || !personInfo.age || !personInfo.nationality) {
    res.render('message', { message: 'missing required info', type: 'error' });
  } else {
    const newPerson = new Person({
      name: personInfo.name,
      age: personInfo.age,
      nationality: personInfo.nationality
    });
    newPerson.save((err, Person) => {
      if (err)
        res.render('message', { message: 'database error', type: 'error' });
      else
        res.render('message', {
          message: 'new person saved', type: 'success', person: personInfo
        });
    });
  }
});

// finds all people records from database
app.get('/people', (req, res) => {
  Person.find((err, result) => res.json(result));
});

// updates a record in database
app.put('/people/:id', (req, res) => {
  Person.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
    if (err)
      res.json({message: 'error updating person with id ' + req.params.id});
    res.json(result);
  });
});

// deletes a record from database
app.delete('/people/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id, (err, result) => {
    if (err)
      res.json({message: 'error updating person with id ' + req.params.id});
    res.json(result);
  });
});

// configures static directories with virtual prefixing
// e.g. /public/a.js => /static/a.js
app.use('/static', express.static('public'));

// serves static files
app.get('/testimage', (req, res) => {
  res.render('testimage');
});

// configures ./views as directory for pug templates
app.set('view engine', 'pug');
app.set('views', './views');

// combines multiple pug files
app.get('/components', (req, res) => {
  res.render('content');
});

// generates dynamic web pages
app.get('/dynamic', (req, res) => {
  res.render('dynamic', {
    name: 'tutorials point',
    url: 'http://www.tutorialspoint.com'
  });
});

// middleware before request was handled
app.use('/mid', (req, res, next) => {
  console.log('Request for things received at ' + Date.now());
  next();
});

// request handler for GET /mid
app.get('/mid', (req, res, next) => {
  console.log('Sending request at ' + Date.now());
  res.send('mid');
  next();
});

// middleware after response was sent
app.use('/mid', (req, res) => {
  console.log('End middleware at ' + Date.now());
});

// uses external routers to handle all requests to /things/*
app.use('/things', things);

// handles invalid request URLs
app.get('*', (req, res) => {
  res.send('cannot find routes for ' + req.url);
});

app.listen(3000);
