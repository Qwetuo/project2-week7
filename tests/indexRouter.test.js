const request = require("supertest");
const express = require("express");

const indexRouter = require("../routes/indexRouter");

const app = express();
indexRouter(app);

test("GET / should return message", async () => {
  const response = await request(app).get("/");
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual(
    "Welcome to Lender-api. Please visit https://lendar-api.herokuapp.com/api-docs for api-documentation"
  );
});
