const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config.json');
const imagesRouter = require(__dirname + '/modules/api/images/');
const usersRouter = require(__dirname + '/modules/api/users/');
const profileRouter = require(__dirname + '/modules/api/profile/');
const clientRouter = require('./client');
const session = require('express-session');
// const cookieParser = require('cookie-parser');

var app = express();

//set public folder public
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ extended : true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret : 'lol', resave : false, saveUninitialized: true,  cookie : {} }))
// app.use(cookieParser());

app.use('/', clientRouter);
app.use('/api/image', imagesRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);

mongoose.connect(config.connectionString, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected db success');
  }
})

//mo 1 cai port de chay local
app.listen(config.port, (req, res) => {
  console.log(`app listen on ${config.port}`);
})
