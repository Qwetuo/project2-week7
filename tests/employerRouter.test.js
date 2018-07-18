const request = require("supertest");
const express = require("express");

const employerRouter = require("../routes/employerRouter");
const signupRouter = require("../routes/signupRouter");
const signinRouter = require("../routes/signinRouter");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");
const Employer = require("../models/employer");
const Posting = require("../models/posting");

const app = express();
employerRouter(app);
signupRouter(app);
signinRouter(app);

let jwtTokenEmployer1;
let jobId1;

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);

  const employer1 = { username: "employer100", password: "000000" };
  await request(app)
    .post("/signup/employer")
    .send(employer1);

  let response = await request(app)
    .post("/signin/employer")
    .send(employer1);
  jwtTokenEmployer1 = await response.body.token;
});

beforeEach(async () => {
  // mongoose.connection.db.dropDatabase();
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /employer without token should give unauthorized", async () => {
  const response = await request(app).get("/employer");
  expect(response.status).toEqual(401);
  expect(response.text).toEqual("Unauthorized");
});

test("GET /employer with employee(wrong) token should inform incorrect authorization", async () => {
  const employeeTest = { username: "employee1000", password: "000000" };
  await request(app)
    .post("/signup/employee")
    .send(employeeTest);

  let getEmployeeToken = await request(app)
    .post("/signin/employee")
    .send(employeeTest);
  const employeeToken = await getEmployeeToken.body.token;

  const response = await request(app)
    .get("/employer")
    .set("Authorization", "Bearer " + employeeToken);
  expect(response.status).toEqual(401);
  expect(response.body.message).toEqual(
    "You don't have the correct authorization to view this"
  );
});

test("GET /employer should provide account details of token holder", async () => {
  const response = await request(app)
    .get("/employer")
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body.username).toEqual("employer100");
});

test("POST /employer/posts should add a new job posting by the employer", async () => {
  const newJob = {
    title: "new job1",
    pay: "9",
    desc: "new job 1 desc",
    req: "requirements for job 1",
    location: "east",
    type: "others",
    commitment: [30072018, 31072018]
  };
  const response = await request(app)
    .post("/employer/posts")
    .send(newJob)
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(201);
  expect(response.body.message).toEqual("new job created successfully");
  jobId1 = response.body.job_id;
  const posting = await Posting.findById(jobId1).populate("employer");
  expect(posting.employer.username).toEqual("employer100");
  expect(posting.title).toEqual("new job1");
});

test("GET /posts should show all the job posting made by the employer", async () => {
  const newJob2 = {
    title: "new job2"
  };
  await request(app)
    .post("/employer/posts")
    .send(newJob2)
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  const response = await request(app)
    .get("/employer/posts")
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body.length).toBe(2);
});

test("GET /posts/:id should show the job posting with correct id", async () => {
  const response = await request(app)
    .get(`/employer/posts/${jobId1.replace(/['"]+/g, '')}`)
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body._id).toEqual(jobId1)
});
