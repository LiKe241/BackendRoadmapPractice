const userModel = require('../models').Users;
const bcrypt = require('bcrypt');
const saltRounds = 5;

// registerInfo = { name, password }
exports.register = async (registerInfo, res, next) => {
  const passwordHash = await bcrypt.hash(registerInfo.password, saltRounds);
  const newUser = new userModel({
    name: registerInfo.name,
    password: passwordHash
  });
  if (await userModel.findOne({ name: newUser.name })) {
    next({ code: 400, message: 'user ' + newUser.name + ' already exists' });
  } else {
    newUser.save();
    res.cookie('name', newUser.name);
    res.redirect(301, '/main');
  }
};

// loginInfo = { name, password }
exports.login = async (loginInfo, res, next) => {
  const savedInfo = await userModel.findOne({ name: loginInfo.name });
  if (!savedInfo) {
    // could not find username in database
    next({ code: 400, message: 'user ' + loginInfo.name + ' does not exist' });
  } else if (await bcrypt.compare(loginInfo.password, savedInfo.password)) {
    // user's password matched with password in database
    res.cookie('name', loginInfo.name);
    res.redirect(301, '/main');
  } else {
    // user's password did not match with password in database
    next({ code: 400, message: 'password does not match record' });
  }
};
