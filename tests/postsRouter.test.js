require("dotenv").config();
const request = require("supertest");
const express = require("express");

const employerRouter = require("../routes/employerRouter");
const postsRouter = require("../routes/postsRouter");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const { getEmployerId, createPost } = require("./test_helper");

const app = express();
employerRouter(app);
postsRouter(app);

let employerId1;
let employerId2;

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);

  const employer1 = {
    username: "employer1",
    password: "000000",
    coyName: "e1 company name"
  };
  employerId1 = await getEmployerId(employer1);
  const employer2 = {
    username: "employer2",
    password: "000000",
    coyName: "e2 company name"
  };
  employerId2 = await getEmployerId(employer2);

  const newJob1 = {
    title: "new job1",
    pay: "9",
    desc: "new job 1 desc",
    req: "requirements for job 1",
    location: "east",
    type: "others",
    commitment: ["30072018", "31072018"],
    employer: `${employerId1}`,
    status: "active"
  };
  const newJob2 = {
    title: "new job2",
    pay: "11",
    desc: "new job 2 desc",
    req: "requirements for job 2",
    location: "west",
    type: "usher",
    commitment: ["01012019"],
    employer: `${employerId2}`,
    status: "active"
  };
  const newJob3 = {
    title: "job3",
    pay: "12",
    location: "east",
    type: "others",
    employer: `${employerId1}`,
    status: "active"
  };

  jobId1 = await createPost(newJob1);
  jobId2 = await createPost(newJob2);
  jobId3 = await createPost(newJob3);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /posts should return an array of all the available postings", async () => {
  const response = await request(app).get("/posts");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(3);
});

test("GET /search should return an array of post that match the search -status", async () => {
  const response = await request(app).get("/posts/search?status=active");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(3);
});

test("GET /search should return an array of post that match the search -employer", async () => {
  const response = await request(app).get("/posts/search?employer=e1");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test("GET /search should return an array of post that match the search -min", async () => {
  const response = await request(app).get("/posts/search?min=10");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
  expect(response.body[0].pay).toBeGreaterThan(10);
});

test("GET /search should return an array of post that match the search -type", async () => {
  const response = await request(app).get("/posts/search?type=others");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
  expect(response.body[0].type).toBe("others");
});

test("GET /search should return an array of post that match the search -location", async () => {
  const response = await request(app).get("/posts/search?location=east");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
  expect(response.body[0].location).toBe("east");
});

test("GET /search should return an array of post that match multiple search", async () => {
  const response = await request(app).get("/posts/search?min=10&type=others");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].type).toBe("others");
  expect(response.body[0].pay).toBeGreaterThan(10);
});
