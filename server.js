const app = require("./app");
const mongoose = require("mongoose");
const seedDataIfNeeded = require("./seedData");

const PORT = process.env.PORT || 3000;
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/project2";

mongoose.connect(
  mongodb_uri,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on("error", error => {
  console.error("An error occurred!", error);
});

db.on("connected", async () => {
  await seedDataIfNeeded();
});

app.listen(PORT, function() {
  console.log(`application started on port ${PORT}...`);
});
