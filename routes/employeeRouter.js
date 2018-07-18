const express = require("express");

const Employee = require("../models/employee");
const { passport } = require("../config/passport")

const router = express.Router();
router.use(express.json())

router.get("/", async (req, res, next) => {
  res.json(req.user);
});

router.put("/", async (req,res,next) => {
    await Employee.findByIdAndUpdate(req.user._id, req.body);
    res.json({message: `update for ${req.user.username} successful` })
})

router.delete("/", async (req,res,next) => {
    await Employee.findByIdAndRemove(req.user._id)
    res.json({message: `delete account for ${req.user.username} successful`})
})

module.exports = app => {
  app.use("/employee",
  passport.authenticate("jwt", {session: false}),
  router)
}