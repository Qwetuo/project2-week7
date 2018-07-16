const express = require("express");
const swaggerDocument = require("../swagger.json");
const swaggerUi = require("swagger-ui-express");

// const jwt = require("jsonwebtoken");
// const Admin = require("../models/admin");
// const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json())

router.get("/", (req, res) => {
  console.log(req.user);
  res.json({ message: "Please visit https://lendar-api.herokuapp.com/api-docs for documentation" });
});

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

module.exports = app => {
  // app.use(express.json())
  app.use("/", router)
}
