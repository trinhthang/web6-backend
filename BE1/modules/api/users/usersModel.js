const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const ObjectId = Schema.ObjectId;

var usersSchema = new Schema({
  id : { type : Number, required : true, unique : true },
  username : { type : String, required : true, unique : true },
  password : { type : String, required : true, minlength : 6 },
  email :
  { type : String, required : true, unique : true, validate : {
    validator :
      (value) => {
        var regex = /@/;
        return regex.test(value);
      },
      message : '{VALUE} is not valid email',
  } },
  avatar : { type : String , default : ''},
  createdDate :
  { type : Date, default : new Date().toISOString() },
  updatedDate :
  { type : Date, default : new Date().toISOString() },
  profile : { type : ObjectId, ref : 'profiles', default : null}
});

usersSchema.index({username : "text", email : "text"});

usersSchema.pre('save', function (next) {
  var user = this;
  console.log("this is user",user);

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    })
  })
});

module.exports = mongoose.model('users', usersSchema);
