const express = require("express");
const router = express.Router();
const { passport } = require("../config/passport");

router.get("/", (req, res, next) => {
  res.json({
    message: "Success! You can not see this without a token",
    whoami: req.user
  });
});

module.exports = app => {
  app.use(
    "/adminSec",
    passport.authenticate("jwt", { session: false }),
    router
  );
};
