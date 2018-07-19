const express = require("express");

const Employee = require("../models/employee");
const Posting = require("../models/posting");
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

router.get("/interested", async (req, res, next) => {
  const posts = await Posting.find()
  const interestedPost = posts.filter(post => (post.interested.indexOf(`${req.user._id}`) !== -1))
  res.status(200).json(interestedPost)
})

router.put("/interested/:id", async (req, res, next) => {
  const post = await Posting.findById(req.params.id)
  if (post.interested.indexOf(`${req.user._id}`) >= 0){
    res.status(200).json({message: `you have already logged your interested`})
  } else {
    await Posting.findByIdAndUpdate(req.params.id, {interested: [...post.interested, req.user._id]})
    res.status(200).json({message: `interest for job ${post.title} logged`})
  }
})


module.exports = app => {
  app.use("/employee",
  passport.authenticate("jwt", {session: false}),
  router)
}