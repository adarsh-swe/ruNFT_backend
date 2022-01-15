const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  image: {
    type: String,
    required: true,
  },
  external_url: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  attributes: [
    {
      duration: String,
    },
    {
      distance: Number,
    },
  ],
  background_color: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("token", TokenSchema);
