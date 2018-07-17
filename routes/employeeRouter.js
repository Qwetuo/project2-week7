const express = require("express");

const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");
const { jwtOptions } = require("../config/passport");
const { passport } = require("../config/passport")

const router = express.Router();
router.use(express.json())

router.get("/", async (req, res, next) => {
  const employee = await Employee.find();
  res.json(employee);
});

router.post("/signup", async (req, res, next) => {
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


router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const employee = await Employee.findOne({ username: username });
  console.log(employee)

  if (!employee) {
    res.status(401).json({ message: "no such user found" });
  }

  if (employee.validPassword(password)) {
    const employeeId = { id: employee.id };
    const token = jwt.sign(employeeId, jwtOptions.secretOrKey);
    res.json({ message: "sign in successful", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

module.exports = app => {
  // app.use(express.json())
  app.use("/employee", router)
}