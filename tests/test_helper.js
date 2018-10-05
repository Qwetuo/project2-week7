require("dotenv").config();
const Employer = require("../models/employer");
const Employee = require("../models/employee");
const Posting = require("../models/posting");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");

const saveEmployer = async employer => {
  const { username, name, email, mobile, coyName, UEN } = employer;
  const newEmployer = new Employer({
    username,
    name,
    email,
    mobile,
    coyName,
    UEN
  });
  newEmployer.setPassword(employer.password);
  return await newEmployer.save();
};

const getEmployerId = async employer => {
  const savedEmployer = await saveEmployer(employer);

  return savedEmployer._id;
};

const getEmployerToken = async employer => {
  const savedEmployer = await saveEmployer(employer);
  const userId = { id: savedEmployer._id };
  const token = jwt.sign(userId, jwtOptions.secretOrKey);
  return token;
};

const createEmployee = async employee => {
  const { username, name, email, mobile, citizen, education, avail } = employee;
  const newEmployee = new Employee({
    username,
    name,
    email,
    mobile,
    citizen,
    education,
    avail
  });
  newEmployee.setPassword(employee.password);
  const savedEmployee = await newEmployee.save();
  const userId = { id: savedEmployee._id };
  const token = jwt.sign(userId, jwtOptions.secretOrKey);
  return { id: savedEmployee._id, token: token };
};

const createPost = async job => {
  const {
    title,
    pay,
    desc,
    req,
    location,
    type,
    commitment,
    employer,
    status
  } = job;
  const newJob = new Posting({
    title,
    pay,
    desc,
    req,
    location,
    type,
    commitment,
    employer,
    status
  });
  const savedJob = newJob.save();

  return savedJob._id;
};

module.exports = {
  getEmployerId,
  getEmployerToken,
  createEmployee,
  createPost
};

// For reference
// const request = require("supertest");
// const express = require("express");

// const employerRouter = require("../routes/employerRouter");
// const postsRouter = require("../routes/postsRouter");
// const signupRouter = require("../routes/signupRouter");
// const signinRouter = require("../routes/signinRouter");

// const { MongoMemoryServer } = require("mongodb-memory-server");
// const mongod = new MongoMemoryServer();
// const mongoose = require("mongoose");
// const Employer = require("../models/employer");
// const Posting = require("../models/posting");

// const app = express();
// employerRouter(app);
// postsRouter(app);
// signupRouter(app);
// signinRouter(app);

// let jwtTokenEmployer1;
// let jwtTokenEmployer2;
// let jobId1;
// let jobId2;
// let jobId3;

// beforeAll(async () => {
//   jest.setTimeout(120000);
//   const uri = await mongod.getConnectionString();
//   await mongoose.connect(uri);

//   const employer1 = {
//     username: "employer1",
//     password: "000000",
//     coyName: "e1 company name"
//   };
//   jwtTokenEmployer1 = await getEmployerToken(employer1);
//   const employer2 = {
//     username: "employer2",
//     password: "000000",
//     coyName: "e2 company name"
//   };
//   jwtTokenEmployer2 = await getEmployerToken(employer2);

//   const newJob1 = {
//     title: "new job1",
//     pay: "9",
//     desc: "new job 1 desc",
//     req: "requirements for job 1",
//     location: "east",
//     type: "others",
//     commitment: ["30072018", "31072018"]
//   };
//   const newJob2 = {
//     title: "new job2",
//     pay: "11",
//     desc: "new job 2 desc",
//     req: "requirements for job 2",
//     location: "west",
//     type: "usher",
//     commitment: ["01012019"]
//   };
//   const newJob3 = {
//     title: "job3",
//     pay: "12",
//     location: "east",
//     type: "others"
//   };
//   jobId1 = await createPost(newJob1, jwtTokenEmployer1);
//   jobId2 = await createPost(newJob2, jwtTokenEmployer2);
//   jobId3 = await createPost(newJob3, jwtTokenEmployer1);
// });

// afterAll(() => {
//   mongoose.disconnect();
//   mongod.stop();
// });

// const getEmployerToken = async employer => {
//   await request(app)
//     .post("/signup/employer")
//     .send(employer);

//   let response = await request(app)
//     .post("/signin/employer")
//     .send({ username: employer.username, password: employer.password });
//   return await response.body.token;
// };

// const createPost = async (job, token) => {
//   let response = await request(app)
//     .post("/employer/posts")
//     .send(job)
//     .set("Authorization", "Bearer " + token);
//   return await response.body.job_id;
// };
