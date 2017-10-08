const express = require('express');
const Router = express.Router();
const profileController = require('./profile.controller');

Router.post('/', (req, res) => {
  profileController.addProfile((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

module.exports = Router;
