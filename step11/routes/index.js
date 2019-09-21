const express = require('express');
const controllers = require('../controllers');

const indexRouter = express.Router();

indexRouter.get('/', (req, res, next) => {
  res.redirect(301, '/public')
});
