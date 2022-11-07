const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Firstname is required"],
  },
  email: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: { type: String, required: [true, "Password is required"] },
  active: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
