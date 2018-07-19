const request = require("supertest");
const express = require("express");

const signupRouter = require("../routes/signupRouter");
const signinRouter = require("../routes/signinRouter");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
signupRouter(app);
signinRouter(app);

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET /signup should return message", async () => {
  const response = await request(app).get("/signup");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual(
    "For Employees /employee, for Employers /employer"
  );
});

test("GET /signin should return message", async () => {
  const response = await request(app).get("/signin");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual(
    "For Admin /admin, for Employees /employee, for Employers /employer"
  );
});

describe("3 signup working", () => {
  test("POST /signup/admin should create a new admin account", async () => {
    const admin1 = {
      username: "admin1",
      password: "000000"
    };
    const response = await request(app)
      .post("/signup/admin")
      .send(admin1);
    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual("admin1");
    expect(response.body.user.bio).toEqual("admin");
    expect(response.body.user.hash).not.toBeUndefined();
  });

  test("POST /signup/employee should create a new employee account", async () => {
    const employee1 = {
      username: "employee1",
      name: "name of employee 1",
      password: "000000",
      email: "employee1@mail.com",
      mobile: "99999999",
      citizen: "Singapore citizen",
      education: "poly"
    };
    const response = await request(app)
      .post("/signup/employee")
      .send(employee1);
    expect(response.status).toEqual(201);
    expect(response.body.employee.username).toEqual("employee1");
    expect(response.body.employee.hash).not.toBeUndefined();
  });

  test("POST /signup/employer should create a new employer account", async () => {
    const employer1 = {
      username: "employer1",
      password: "000000",
      name: "name of employer 1",
      email: "employer1@mail.com",
      mobile: "99999999",
      coyName: "company1",
      UEN: "UEN1"
    };
    const response = await request(app)
      .post("/signup/employer")
      .send(employer1);
    expect(response.status).toEqual(201);
    expect(response.body.employer.username).toEqual("employer1");
    expect(response.body.employer.hash).not.toBeUndefined();
  });
});

describe("3 signin working", () => {
  test("POST /signin/admin should provide a token if correct credentials provided", async () => {
    const admin1login = {
      username: "admin1",
      password: "000000"
    };
    const response = await request(app)
      .post("/signin/admin")
      .send(admin1login);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("sign in successful");
    expect(response.body.token).not.toBeUndefined();
  });
  test("POST /signin/employee should provide a token if correct credentials provided", async () => {
    const employee1login = {
      username: "employee1",
      password: "000000"
    };
    const response = await request(app)
      .post("/signin/employee")
      .send(employee1login);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("sign in successful");
    expect(response.body.token).not.toBeUndefined();
  });

  test("POST /signin/employer should provide a token if correct credentials provided", async () => {
    const employer1login = {
      username: "employer1",
      password: "000000"
    };
    const response = await request(app)
      .post("/signin/employer")
      .send(employer1login);
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual("sign in successful");
    expect(response.body.token).not.toBeUndefined();
  });
});

describe("should fail signup with non-unique username", () => {
  test("POST /signup/admin using a duplicated username should fail", async () => {
    const admin1 = {
      username: "admin1",
      password: "000000"
    };
    const response = await request(app)
      .post("/signup/admin")
      .send(admin1);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(
      "User validation failed: username: should be unique"
    );
  });
});

describe("should fail signin with wrong credentials", () => {
  test("POST /signin/admin should inform 'no such user found' if incorrect username provided", async () => {
    const adminWronglogin = {
      username: "wrongadmin",
      password: "00000"
    };
    const response = await request(app)
      .post("/signin/admin")
      .send(adminWronglogin);
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("no such user found");
    expect(response.body.token).toBeUndefined();
  });

  test("POST /signin/admin should inform 'passwords did not match' if incorrect password provided", async () => {
    const adminWronglogin = {
      username: "admin1",
      password: "wrongpassword"
    };
    const response = await request(app)
      .post("/signin/admin")
      .send(adminWronglogin);
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("passwords did not match");
    expect(response.body.token).toBeUndefined();
  });
});
