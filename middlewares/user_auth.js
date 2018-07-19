const Admin = require("../models/admin");
const Employer = require("../models/employer");
const Employee = require("../models/employee");

const isAdmin = (req, res, next) => {
  if (req.user.bio !== "admin") {
    res.status(401).json({
      message: "You don't have the correct authorization to view this",
      whoami: req.user
    });
  } else if (req.user instanceof Admin) {
    next();
  }
};

const isEmployer = (req, res, next) => {
  if (req.user instanceof Employer === false) {
    res.status(401).json({
      message: "You don't have the correct authorization to view this",
      whoami: req.user
    });
  } else if (req.user instanceof Employer) {
    next();
  }
};

const isEmployee = (req, res, next) => {
  if (req.user instanceof Employee === false) {
    res.status(401).json({
      message: "You don't have the correct authorization to view this",
      whoami: req.user
    });
  } else if (req.user instanceof Employee) {
    next();
  }
};

module.exports = {
  isAdmin,
  isEmployer,
  isEmployee
};
