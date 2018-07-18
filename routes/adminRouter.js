const express = require("express");

const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json())

router.get("/", async (req, res, next) => {
  const admin = await Admin.find();
  res.json(admin);
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const user = new Admin({ username, bio: "admin" });
  user.setPassword(password);
  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});


router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await Admin.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res.json({ message: "sign in successful", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

module.exports = app => {
  // app.use(express.json())
  app.use("/admin", router)
}