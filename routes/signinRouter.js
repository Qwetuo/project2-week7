const express = require("express");

const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const Admin = require("../models/admin");
const Employee = require("../models/employee");
const Employer = require("../models/employer");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res, next) => {
  res.json(
    "For Admin /admin, for Employees /employee, for Employers /employer"
  );
});

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  const user = await Admin.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  } else if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res.json({ message: "sign in successful", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

router.post("/employee", async (req, res) => {
  const { username, password } = req.body;

  const employee = await Employee.findOne({ username: username });

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

router.post("/employer", async (req, res) => {
  const { username, password } = req.body;

  const employer = await Employer.findOne({ username: username });

  if (!employer) {
    res.status(401).json({ message: "no such user found" });
  }

  if (employer.validPassword(password)) {
    const employerId = { id: employer.id };
    const token = jwt.sign(employerId, jwtOptions.secretOrKey);
    res.json({ message: "sign in successful", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

module.exports = app => {
  app.use("/signin", router);
};
