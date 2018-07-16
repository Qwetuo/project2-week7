const express = require("express");

const { passport } = require("./config/passport");
const morgan = require("morgan");
// const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/xxx"

const indexRouter = require("./routes/indexRouter");
const AdminRouter = require("./routes/adminRouter");
const { handle404, handle500 } = require("./middlewares/error_handlers");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

app.use("/", indexRouter);
app.use(
  "/adminSec",
  passport.authenticate("jwt", { session: false }),
  AdminRouter
);

app.use(handle404);
app.use(handle500);

module.exports = app;