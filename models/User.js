const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  allTimeScore: {
    type: Number,
    required: false,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
