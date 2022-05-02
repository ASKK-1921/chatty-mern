const router = require("express").Router();
const User = require("../models/User");

// Create user
router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, picture } = req.body;
    const user = await User.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (err) {
    let msg;
    if (err.code === 11000) {
      msg = "User already exists.";
    } else {
      msg = err.message;
    }
    console.log(err);
    res.status(400).json(msg);
  }
});

// log in user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
