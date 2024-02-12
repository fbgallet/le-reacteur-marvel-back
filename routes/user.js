const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");
const emailRegex = /^[\w\-\.]+@[\w-]+\.+[\w-]{2,9}$/;

const User = require("../models/User");

// Display availabilities for a given day
router.post("/user/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) {
      res.status(400).json({ message: "Email invalid." });
      return;
    }
    if (!(await isNewUser(email))) {
      res
        .status(400)
        .json({ message: "This user exist already. Try to login." });
      return;
    }
    let salt = generateSalt();
    const newUser = new User({
      email: email,
      token: generateToken(),
      hash: generateHash(salt, password),
      salt: salt,
      favorite: [],
    });
    newUser.save();
    res.status(200).json({
      message: "New user created:",
      user: {
        _id: newUser._id,
        token: newUser.token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // console.log("req.body :>> ", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Email and password have to be provided." });
      return;
    }
    const user = await User.findOne({ email: email });
    // console.log("user :>> ", user);
    if (!user) {
      res
        .status(400)
        .json({ message: "This user doesn't exist. Sign up before to login." });
      return;
    }
    if (!isPasswordMatching(password, user)) {
      res.status(400).json({ message: "Wrong password!" });
      return;
    }
    console.log("matching password !");
    res.status(200).json({ message: "User logged in!", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/favorite/", async (req, res) => {
  try {
    // console.log("req.body :>> ", req.body);
    const { token, type, id, action } = req.body;
    if (!type || !id) {
      res
        .status(400)
        .json({ message: "Wrong request. Type and item id are needed" });
      return;
    }
    const user = await User.findOne({ token: token });
    // console.log("user :>> ", user);
    if (!user) {
      res.status(400).json({
        message: "This user doesn't exist. Sign up before add favorite.",
      });
      return;
    }
    let msg = "";
    if (action === "remove") {
      const indexOfFav = user.favorites[type + "s"].indexOf(id);
      user.favorites[type + "s"].splice(indexOfFav, 1);
      msg = "Removed a " + type + " from favorites";
    } else {
      user.favorites[type + "s"].push(id);
      msg = "Added a " + type + " in favorites";
    }
    user.markModified("favorites");
    user.save();
    // console.log(user);
    res.status(200).json({
      message: msg,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function isNewUser(email) {
  const userByMail = await User.findOne({ email: email });
  if (userByMail) return false;
  return true;
}
function generateSalt() {
  return uid2(24);
}
function generateHash(salt, password) {
  return SHA256(password + salt).toString(encBase64);
}
function generateToken() {
  return uid2(16);
}
function isPasswordMatching(password, user) {
  let hash = generateHash(user.salt, password);
  if (hash === user.hash) return true;
  return false;
}
function isValidEmail(email) {
  return (test = emailRegex.test(email));
}

module.exports = router;
