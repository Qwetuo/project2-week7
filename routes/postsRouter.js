const express = require("express");

const Posting = require("../models/posting");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res, next) => {
  const posts = await Posting.find()
    .populate({ path: "employer", select: "coyName" })
    .populate({ path: "interested", select: "username" });
  res.json(posts);
});

router.get("/search", async (req, res, next) => {
  const postings = await Posting.find()
    .populate({ path: "employer", select: "coyName" })
    .populate({ path: "interested", select: "username" });
  const filteredPostings = postings
    .filter(
      post => (req.query.status ? post.status === req.query.status : true)
    )
    .filter(
      post =>
        req.query.employer
          ? post.employer.coyName.includes(req.query.employer)
          : true
    )
    .filter(post => (req.query.min ? post.pay >= req.query.min : true))
    .filter(post => (req.query.type ? post.type === req.query.type : true))
    .filter(
      post =>
        req.query.location ? post.location.includes(req.query.location) : true
    );

  filteredPostings.length === 0 ? next() : res.json(filteredPostings);
});

module.exports = app => {
  app.use("/posts", router);
};
