const express = require('express');
const controllers = require('../controllers');
const userRoutes = require('./user');
const threadRoutes = require('./thread');

const indexRouter = express.Router();

indexRouter.get('/', (req, res, next) => {
  res.redirect(301, '/main');
});

indexRouter.get('/main', (req, res, next) => {
  controllers.getMain(req.cookies.name, res, next);
});

indexRouter.use('/user', userRoutes);

indexRouter.use('/thread', threadRoutes);

indexRouter.all('*', (req, res) => {
  res.render(
    'error',
    { err: { code: 404, message: req.url + ' not found' } }
  );
});

exports.indexRouter = indexRouter;
