const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  token: String,
  hash: String,
  salt: String,
  favorites: {
    characters: [String],
    comics: [String],
  },
});

module.exports = User;
