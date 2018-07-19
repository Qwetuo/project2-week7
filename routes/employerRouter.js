const express = require("express");

const Employer = require("../models/employer");
const Posting = require("../models/posting");
const { passport } = require("../config/passport");
const { isEmployer } = require("../middlewares/user_auth");

const router = express.Router();
router.use(express.json());

router.get("/", isEmployer, async (req, res, next) => {
  res.status(200).json(req.user);
});

router.put("/", isEmployer, async (req, res, next) => {
  await Employer.findByIdAndUpdate(req.user._id, req.body);
  res.json({ message: `update for ${req.user.username} successful` });
});

router.delete("/", isEmployer, async (req, res, next) => {
  await Employer.findByIdAndRemove(req.user._id);
  res.json({ message: `delete account for ${req.user.username} successful` });
});

router.post("/posts", isEmployer, async (req, res, next) => {
  try {
    const newJob = new Posting({
      title: req.body.title,
      pay: req.body.pay,
      desc: req.body.desc,
      req: req.body.req,
      location: req.body.location,
      type: req.body.type,
      commitment: req.body.commitment,
      status: "active",
      employer: req.user._id
    });
    const newSavedJob = await newJob.save();
    res.status(201).json({
      message: `new job created successfully`,
      job_id: newSavedJob._id
    });
  } catch (e) {
    next(e);
  }
});

router.get("/posts", isEmployer, async (req, res, next) => {
  const posts = await Posting.find({ employer: req.user._id });
  res.json(posts);
});

router.get("/posts/:id", isEmployer, async (req, res, next) => {
  const post = await Posting.findById(req.params.id);
  res.json(post);
});

router.put("/posts/:id", isEmployer, async (req, res, next) => {
  try {
    await Posting.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: `updated book with id ${req.params.id} sucessfully`})
  } catch (e) {
    next(e)
  }
})

router.delete("/posts/:id", isEmployer, async (req, res, next) => {
  try {
    await Posting.findByIdAndRemove(req.params.id);
    res.json({message: `deleted book with id ${req.params.id} sucessfully`})
  } catch (e) {
    next(e)
  }
})

module.exports = app => {
  app.use(
    "/employer",
    passport.authenticate("jwt", { session: false }),
    router
  );
};
