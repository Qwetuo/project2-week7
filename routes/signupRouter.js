const express = require("express");

const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json())

router.get("/", async (req, res, next) => {
  res.json("Please use your username and password to login. For Admin /admin, for Employees /employee, for Employers /employer");
});

router.post("/admin", async (req, res, next) => {
  const { username, password } = req.body;
  const user = new Admin({ username, bio: "some bio" });
  user.setPassword(password);
  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/employee", async (req, res, next) => {
    const { username, password, email, mobile, citizen, education } = req.body;
    const employee = new Employee({ username, email, mobile, citizen, education });
    employee.setPassword(password);
    try {
      await employee.save();
      res.json({ employee });
    } catch (employee) {
      next(employee);
    }
  });

module.exports = app => {
  // app.use(express.json())
  app.use("/signup", router)
}