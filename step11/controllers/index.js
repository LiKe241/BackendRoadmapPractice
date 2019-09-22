const userController = require('./user');
const threadController = require('./thread');

exports.register = userController.register;

exports.login = userController.login;

exports.getPublic = threadController.getPublic;

exports.createThread = threadController.createThread;

exports.getThread = threadController.getThread;

exports.postResponse = threadController.postResponse;

exports.disableThread = threadController.disableThread;

exports.updateThread = threadController.updateThread;

exports.getThreadsBy = threadController.getThreadsBy;
