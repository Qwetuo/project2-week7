const express = require("express");
const swaggerDocument = require("../swagger.json");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Lender-api. Please visit https://lendar-api.herokuapp.com/api-docs for api-documentation"
  });
});

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app => {
  app.use("/", router);
};
