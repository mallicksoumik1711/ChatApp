const mongoose = require('mongoose');
// connected in local db. Thus not in prod
mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');

let userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    repeatpassword: String,
});

module.exports = mongoose.model('user', userSchema);
