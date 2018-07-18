const Admin = require("../models/admin")
const Employer = require("../models/employer")

const isAdmin = (req, res, next) => {
  if (req.user.bio !== "admin") {
    res.status(401).json({
      message: "You don't have the correct authorization to view this",
      whoami: req.user
    });
  // } else if (req.user.bio === "admin") {
  } else if (req.user instanceof Admin) {
    next()
  }
};

const isEmployer = (req, res, next) => {
  if (req.user instanceof Employer === false) {
    res.status(401).json({
      message: "You don't have the correct authorization to view this",
      whoami: req.user
    });
  // } else if (req.user.bio === "admin") {
  } else if (req.user instanceof Employer) {
    next()
  }
};

// const isEmployee = (err, req, res, next) => {
//   if (req.user.bio !== "employee") {
//     res.json({
//       message: "Incorrect access.",
//       whoami: req.user
//     });
//   } else if (req.user.bio === "admin") {
//     next()
//   }
// };

module.exports = {
  isAdmin,
  isEmployer
};
