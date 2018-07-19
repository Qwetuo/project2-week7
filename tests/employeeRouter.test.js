const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const employeeRouter = require("../routes/employeeRouter");
const Employee = require("../models/employee");
const { createEmployee } = require("./test_helper");

const app = express();
employeeRouter(app);

let jwtTokenEmployee1;

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);

  const employee1 = { username: "employee100", password: "000000" };
  const savedEmployee1 = await createEmployee(employee1);
  jwtTokenEmployee1 = savedEmployee1.token;
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /employee without token should give unauthorized", async () => {
  const response = await request(app).get("/employee");
  expect(response.status).toEqual(401);
  expect(response.text).toEqual("Unauthorized");
});

test("GET /employee should provide account details of token holder", async () => {
  const response = await request(app)
    .get("/employee")
    .set("Authorization", "Bearer " + `${jwtTokenEmployee1}`);
  expect(response.status).toEqual(200);
  expect(response.body.username).toEqual("employee100");
});

test("DELETE /employee should delete account for token holder", async () => {
  const response = await request(app)
    .delete("/employee")
    .set("Authorization", "Bearer " + `${jwtTokenEmployee1}`);
  expect(response.status).toEqual(200);
  const employees = await Employee.find();
  expect(employees.length).toEqual(0);
});
