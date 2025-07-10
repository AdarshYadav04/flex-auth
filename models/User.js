const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  mobile: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);