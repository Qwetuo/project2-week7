const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/project2";

const seedDataFn = require("./seedData");
const Admin = require("./models/admin");
const Employer = require("./models/employer");
const Employee = require("./models/employee");
const Posting = require("./models/posting");

mongoose.connect(
  mongodb_uri,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on("error", error => {
  console.error("An error occurred!", error);
});

// mongoose.connection.dropCollection("users"); // uncomment this to remove all users from db
// mongoose.connection.dropCollection("employees"); // uncomment this to remove all users from db
// mongoose.connection.dropCollection("employers"); // uncomment this to remove all users from db
// mongoose.connection.dropCollection("postings"); // uncomment this to remove all users from db

db.on("connected", async () => {
  if (
    (await Admin.countDocuments()) == 0 &&
    (await Employer.countDocuments()) == 0 &&
    (await Employee.countDocuments()) == 0 &&
    (await Posting.countDocuments()) == 0
  ) {
    console.log("database is empty, seeding data");
    seedDataFn();
  } else {
    console.log("database not empty, not seeding data");
    // console.log(await Admin.find())
    // console.log(await Employer.find())
    // console.log(await Employee.find())
    // console.log(await Posting.find())
  }
});

app.listen(PORT, function() {
  console.log(`application started on port ${PORT}...`);
});
