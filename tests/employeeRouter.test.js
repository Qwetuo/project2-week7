const request = require("supertest");
const express = require("express");

const employeeRouter = require("../routes/employeeRouter");
const signupRouter = require("../routes/signupRouter");
const signinRouter = require("../routes/signinRouter");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");
const Employee = require("../models/admin");

const app = express();
employeeRouter(app);
signupRouter(app);
signinRouter(app);

let jwtTokenEmployee1;
// const loginAsEmployee1 = async () => {
//   const employee1 = { username: "employee100", password: "000000" };
//   await request(app)
//     .post("/signup/employee")
//     .send(employee1);

//   let response = await request(app)
//     .post("/signin/employee")
//     .send(employee1);
//   jwtTokenEmployee1 = response.body.employee.token;
//   console.log(jwtTokenEmployee1);
// };

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  //   loginAsEmployee1();
  const employee1 = { username: "employee100", password: "000000" };
  await request(app)
    .post("/signup/employee")
    .send(employee1);

  let response = await request(app)
    .post("/signin/employee")
    .send(employee1);
  jwtTokenEmployee1 = response.body.token;
});

beforeEach(async () => {
  // mongoose.connection.db.dropDatabase();
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
    .set("Authorization", "Bearer " + jwtTokenEmployee1);
  console.log(jwtTokenEmployee1);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual("employee100");
});

// test("POST /signup/admin should create a new admin account", async () => {
//   const admin1 = {
//     username: "admin1",
//     password: "000000"
//   };
//   const response = await request(app)
//     .post("/signup/admin")
//     .send(admin1);
//   expect(response.status).toEqual(201);
//   expect(response.body.user.username).toEqual("admin1");
//   expect(response.body.user.bio).toEqual("admin");
//   expect(response.body.user.hash).not.toBeUndefined();
// });

// test("POST /signup/employee should create a new employee account", async () => {
//   const employee1 = {
//     username: "employee1",
//     name: "name of employee 1",
//     password: "000000",
//     email: "employee1@mail.com",
//     mobile: "99999999",
//     citizen: "Singapore citizen",
//     education: "poly"
//   };
//   const response = await request(app)
//     .post("/signup/employee")
//     .send(employee1);
//   expect(response.status).toEqual(201);
//   expect(response.body.employee.username).toEqual("employee1");
//   expect(response.body.employee.hash).not.toBeUndefined();
// });
