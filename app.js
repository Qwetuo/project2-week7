const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/xxx"

const indexRouter = require("./routes/indexRouter");
const AdminSecretRouter = require("./routes/adminSecretRouter");
const adminRouter = require("./routes/adminRouter")
const employeeRouter = require("./routes/employeeRouter")
const employerRouter = require("./routes/employerRouter")
const signupRouter = require("./routes/signupRouter")
const signinRouter = require("./routes/signinRouter")
const postsRouter = require("./routes/postsRouter")

const { passport } = require("./config/passport");
const { handle404, handle500 } = require("./middlewares/error_handlers");


const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

indexRouter(app);
// adminRouter(app)
AdminSecretRouter(app)
employeeRouter(app)
employerRouter(app)
signupRouter(app)
signinRouter(app)
postsRouter(app)

// app.use(
//   "/adminSec",
//   passport.authenticate("jwt", { session: false }),
//   AdminSecretRouter
// );

app.use(handle404);
app.use(handle500);

module.exports = app;
