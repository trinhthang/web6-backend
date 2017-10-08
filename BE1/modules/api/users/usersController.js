const mongoose = require('mongoose');

const usersModel = require('./usersModel');
const token = require('../../utilities/token');
const bcrypt = require('bcrypt');

var createUser = (data, callback) => {
  usersModel.findOne({})
    .select('id')
    .sort({id : -1})
    .exec((err, doc) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        var id;
        if (doc && doc.id) {
          id = doc.id + 1;
        } else {
          id = 1;
        }
        data.id = id;
        usersModel.create(data, (err, doc) => {
          if (err) {
            console.log(err);
            console.log('message', err.message);
            console.log('error message', err.errmsg);
            callback(err);
          } else {
            callback(null,doc);
          }
        })
      }
    })
}

var getUserByUsername = (username, callback) => {
  try {
    usersModel.findOne({username : username}).populate('profile').exec((err, user) => {
      if (err) {
        callback(err);
      } else {
        callback(null, user);
      }
    })
  } catch (e) {
    console.log(e);
    callback(e);
  }
}

var searchUserByUsernameAndEmail = (searchString, callback) => {
  try {
    usersModel.find({ $text: { $search: searchString } }).exec((err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    })
  } catch (e) {
    console.log(e);
    callback(e);
  }
}

var signIn = (data, callback) => {
  if (data && data.username && data.password) {
    getUserByUsername(data.username, (err, user) => {
      if (user) {
        bcrypt.compare(data.password, user.password, (err, res) => {
          if (res) {
            callback(null, user);
          } else {
            callback('sai password');
          }
        })
      } else {
        callback('user not found');
      }
    })
  }
}

var getUserByToken = (userToken, callback) => {
    console.log('user token', userToken);
    var userInfo = token.decodeToken(userToken);

    getUserByUsername(userInfo.username, (err, doc) => {
      if (doc) {
        callback(null, doc);
      } else {
        callback('token not valid');
      }
    })
}

var authenMiddleware = (req, res, next) => {
  var userToken = req.session.token;

  if (userToken) {
    getUserByToken(userToken, (err, doc) => {
      if (doc) {
        req.userInfo = {
          id : doc._id,
          username : doc.username,
          profile : doc.profile
        }
        next();
      } else {
        res.send('Token invalid');
      }
    })
  } else {
    res.send('Not authenticate');
  }
}

module.exports = {
  createUser,
  searchUserByUsernameAndEmail,
  signIn,
  authenMiddleware
}
