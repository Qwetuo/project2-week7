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

const isCorrespondingEmployer = async (req, res, next) => {
	let post;

	console.log(req.params.id);
	try {
		post = await Posting.findById(req.params.id);
		if (!post) post = {};
	} catch (err) {
		post = {};
	}

	console.log("HEREEEEE", post, req.user);

	if (post.employer && areIdEqual(post.employer._id, req.user._id)) {
		return next();
	}
	return res.status(403).json("Unauthorized");
};

const areIdEqual = (id1, id2) => {
	console.log(id1, id2);
	if (!id1 || !id2) return false;
	else return id1.toString() == id2.toString();
};

module.exports = {
	isAdmin,
	isEmployer,
	isEmployee,
	isCorrespondingEmployer
};
