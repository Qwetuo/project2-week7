const request = require("supertest");
const express = require("express");

const indexRouter = require("../routes/indexRouter");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
indexRouter(app);

test("GET / should return hello world", async () => {
  const response = await request(app).get("/");
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual("Hello World");
});