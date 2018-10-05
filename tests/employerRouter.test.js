require("dotenv").config();
const request = require("supertest");
const express = require("express");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const employerRouter = require("../routes/employerRouter");
const Posting = require("../models/posting");
const { getEmployerToken, createEmployee } = require("./test_helper");

const app = express();
employerRouter(app);

let jwtTokenEmployer1;
let jobId1;

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);

  const employer1 = { username: "employer100", password: "000000" };
  jwtTokenEmployer1 = await getEmployerToken(employer1);
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
  const savedEmployee = await createEmployee(employeeTest);
  const employeeToken = savedEmployee.token;

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
    .get(`/employer/posts/${jobId1.replace(/['"]+/g, "")}`)
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body._id).toEqual(jobId1);
});


test("PUT /posts/:id should update job posting", async () => {
  const response = await request(app)
    .put(`/employer/posts/${jobId1.replace(/['"]+/g, "")}`)
    .send({ pay: "100", desc: "updated description" })
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual(
    `updated book with id ${jobId1} sucessfully`
  );
  const posting = await Posting.findById(jobId1).populate("employer");
  expect(posting.employer.username).toEqual("employer100");
  expect(posting.title).toEqual("new job1");
  expect(posting.pay).toEqual(100);
  expect(posting.desc).toEqual("updated description");
});



test("DELETE /posts/:id should delete the job posting", async () => {
  const response = await request(app)
    .delete(`/employer/posts/${jobId1.replace(/['"]+/g, "")}`)
    .set("Authorization", "Bearer " + jwtTokenEmployer1);
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual(
    `deleted book with id ${jobId1} sucessfully`
  );
  const postings = await Posting.find();
  expect(postings.length).toBe(1);
  expect(postings[0]._id).not.toBe(jobId1);
});
