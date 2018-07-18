const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/project2"

const seedAdmin = require("./seedData")

mongoose.connect(
  mongodb_uri,
{useNewUrlParser: true}
);

// seedAdmin()
const db = mongoose.connection;
db.on("error", error => {
  console.error("An error occurred!", error);
});


// mongoose.connect(
//   "mongodb://localhost:27017/express-authentication-lab-2",
//   { useNewUrlParser: true }
// );
// mongoose.connection.dropCollection("users"); // uncomment this to remove all users from db

app.listen(PORT, function() {
  console.log(`application started on port ${PORT}...`);
});
