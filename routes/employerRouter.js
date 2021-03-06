const express = require("express");

const Employer = require("../models/employer");
const Posting = require("../models/posting");
const { passport } = require("../config/passport");
const {
	isEmployer,
	isCorrespondingEmployer
} = require("../middlewares/user_auth");

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res, next) => {
	res.status(200).json(req.user);
});

router.put("/", async (req, res, next) => {
	await Employer.findByIdAndUpdate(req.user._id, req.body);
	res
		.status(200)
		.json({ message: `update for ${req.user.username} successful` });
});

router.delete("/", async (req, res, next) => {
	await Employer.findByIdAndRemove(req.user._id);
	res
		.status(200)
		.json({ message: `delete account for ${req.user.username} successful` });
});

router.post("/posts", async (req, res, next) => {
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

router.get("/posts", async (req, res, next) => {
	const posts = await Posting.find({ employer: req.user._id });
	res.status(200).json(posts);
});

router.get("/posts/:id", async (req, res, next) => {
	const post = await Posting.findById(req.params.id);
	if (post === null) {
		res.status(400).json("job id not found");
	}
	if (`${post.employer._id}` === `${req.user._id}`) {
		res.status(200).json(post);
	} else {
		res.status(401).json("Unauthorized");
	}
});

router.put("/posts/:id", async (req, res, next) => {
	try {
		const post = await Posting.findById(req.params.id);
		if (post === null) {
			res.status(400).json("job id not found");
		}
		if (`${post.employer._id}` === `${req.user._id}`) {
			await Posting.findByIdAndUpdate(req.params.id, req.body);
			res
				.status(200)
				.json({ message: `updated book with id ${req.params.id} sucessfully` });
		} else {
			res.status(401).json("Unauthorized");
		}
	} catch (e) {
		next(e);
	}

	// try {
	// 	await Posting.findByIdAndUpdate(req.params.id, req.body);
	// 	res
	// 		.status(200)
	// 		.json({ message: `updated book with id ${req.params.id} sucessfully` });
	// } catch (err) {
	// 	next(err);
	// }
});

router.delete("/posts/:id", isEmployer, async (req, res, next) => {
	try {
		const post = await Posting.findById(req.params.id);
		if (post === null) {
			res.status(400).json("job id not found");
		}
		if (`${post.employer._id}` === `${req.user._id}`) {
			await Posting.findByIdAndRemove(req.params.id);
			res
				.status(200)
				.json({ message: `deleted book with id ${req.params.id} sucessfully` });
		} else {
			res.status(401).json("Unauthorized");
		}
	} catch (e) {
		next(e);
	}
});

module.exports = app => {
	app.use(
		"/employer",
		passport.authenticate("jwt", { session: false }),
		isEmployer,
		router
	);
};
