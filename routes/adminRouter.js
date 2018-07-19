const express = require("express");
const router = express.Router();
const { passport } = require("../config/passport");
const { isAdmin } = require("../middlewares/user_auth");

const Employee = require("../models/employee");
const Employer = require("../models/employer");

router.get("/", isAdmin, (req, res, next) => {
  res.json({
    message: "Welcome to the admin homepage",
    whoami: req.user
  });
});

router.get("/employee", isAdmin, async (req, res, next) => {
  const employees = await Employee.find();
  res.json(employees);
});

router.get("/employee/:name", isAdmin, async (req, res, next) => {
  const employeeQ = await Employee.findOne({ username: req.params.name });
  res.json(employeeQ);
});

router.get("/employer", isAdmin, async (req, res, next) => {
  const employers = await Employer.find();
  res.json(employers);
});

router.get("/employer/:name", isAdmin, async (req, res, next) => {
  const employerQ = await Employer.findOne({ username: req.params.name });
  res.json(employerQ);
});

module.exports = app => {
  app.use("/admin", passport.authenticate("jwt", { session: false }), router);
};
