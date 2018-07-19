const express = require("express");

const Admin = require("../models/admin");
const Employee = require("../models/employee");
const Employer = require("../models/employer");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res, next) => {
  res.json("For Employees /employee, for Employers /employer");
});

router.post("/admin", async (req, res, next) => {
  if ((await Admin.findOne({ username: req.body.username }, null)) !== null) {
    res.status(400).json("User validation failed: username: should be unique");
  } else {
    const { username, password } = req.body;
    const user = new Admin({ username, bio: "admin" });
    user.setPassword(password);
    try {
      await user.save();
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }
});

router.post("/employee", async (req, res, next) => {
  if (
    (await Employee.findOne({ username: req.body.username }, null)) !== null
  ) {
    res.status(400).json("User validation failed: username: should be unique");
  } else {
    const {
      username,
      name,
      password,
      email,
      mobile,
      citizen,
      education
    } = req.body;
    const employee = new Employee({
      username,
      name,
      email,
      mobile,
      citizen,
      education
    });
    employee.setPassword(password);
    try {
      await employee.save();
      res.status(201).json({ employee });
    } catch (employee) {
      next(employee);
    }
  }
});

router.post("/employer", async (req, res, next) => {
  if (
    (await Employer.findOne({ username: req.body.username }, null)) !== null
  ) {
    res.status(400).json("User validation failed: username: should be unique");
  } else {
    const { username, password, name, email, mobile, coyName, UEN } = req.body;
    const employer = new Employer({
      username,
      name,
      email,
      mobile,
      coyName,
      UEN
    });
    employer.setPassword(password);
    try {
      await employer.save();
      res.status(201).json({ employer });
    } catch (employer) {
      next(employer);
    }
  }
});

module.exports = app => {
  app.use("/signup", router);
};
