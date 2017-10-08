const profileModel = require('./profile.model');
var testTemplate = {
  page : 1,
  pageName : "api/image",
  read : true,
  create : true,
  update : true,
  delete : false
}

var testProfile = {
  name : 'tesProfile',
  author : [{testTemplate}],
}

var addProfile = (callback) => {
  testProfile.author.push(testTemplate);
  profileModel.save(testProfile, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  })
}
module.exports = {
  addProfile
}
