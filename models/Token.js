const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  image: {
    type: String,
    required: true,
  },
  imageHosted: {
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
      trait_type: String,
      value: Object,
    },
  ],
  background_color: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("token", TokenSchema);
