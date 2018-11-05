const Admin = require("./models/admin");
const Employer = require("./models/employer");
const Employee = require("./models/employee");
const Posting = require("./models/posting");

const seedDataIfNeeded = async () => {
  if (
    (await Admin.countDocuments()) == 0 &&
    (await Employer.countDocuments()) == 0 &&
    (await Employee.countDocuments()) == 0 &&
    (await Posting.countDocuments()) == 0
  ) {
    console.log("database is empty, seeding data");
    seedDataFn();
  } else {
    console.log("database not empty, not seeding data");
  }
}


const seedDataFn = async () => {
  async function saveAdmins() {
    const admins = [
      {
        username: "admin1",
        password: "000000"
      },
      {
        username: "admin2",
        password: "000000"
      }
    ];

    const savedAdmins = admins.map(admin => {
      const { username } = admin;
      const newAdmin = new Admin({ username, bio: "admin" });
      newAdmin.setPassword(admin.password);
      return newAdmin.save();
    });

    return await Promise.all(savedAdmins);
  }

  async function saveEmployers() {
    const employers = [
      {
        username: "employer1",
        name: "employer1 name",
        password: "000000",
        email: "employer1@mail.com",
        mobile: "99999999",
        coyName: "c1 by employer1",
        UEN: "UEN employer1"
      },
      {
        username: "employer2",
        name: "employer2 name",
        password: "000000",
        email: "employer2@mail.com",
        mobile: "99999999",
        coyName: "c2 by employer2",
        UEN: "UEN employer2"
      }
    ];

    const savedEmployers = employers.map(employer => {
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
      return newEmployer.save();
    });

    return await Promise.all(savedEmployers);
  }

  async function saveEmployees() {
    const employees = [
      {
        username: "employee1",
        password: "000000",
        name: "e1 name",
        email: "e1@mail.com",
        mobile: "00000000",
        citizen: "singapore",
        education: "poly",
        avail: []
      },
      {
        username: "employee2",
        password: "000000",
        name: "e2 name",
        email: "e2@mail.com",
        mobile: "00000000",
        citizen: "singapore",
        education: "university",
        avail: []
      },
      {
        username: "employee3",
        password: "000000",
        name: "e3 name",
        email: "e3@mail.com",
        mobile: "00000000",
        citizen: "singapore",
        education: "secondary",
        avail: []
      }
    ];

    const savedEmployees = employees.map(employee => {
      const {
        username,
        name,
        email,
        mobile,
        citizen,
        education,
        avail
      } = employee;
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
      return newEmployee.save();
    });

    return await Promise.all(savedEmployees);
  }

  async function savePostings() {
    await saveAdmins();
    const savedEmployers = await saveEmployers();
    const savedEmployees = await saveEmployees();

    const postings = [
      {
        title: "new job1",
        pay: "9",
        desc: "new job 1 desc",
        req: "requirements for job 1",
        location: "east",
        type: "others",
        commitment: ["30072018", "31072018"],
        employer: savedEmployers[0]._id,
        status: "active",
        interested: [savedEmployees[0]._id, savedEmployees[1]._id]
      },
      {
        title: "new job2",
        pay: "11",
        desc: "new job 2 desc",
        req: "requirements for job 2",
        location: "west",
        type: "usher",
        commitment: ["01012019"],
        employer: savedEmployers[1]._id,
        status: "active",
        interested: [savedEmployees[1]._id]
      },
      {
        title: "job3",
        pay: "12",
        location: "east",
        type: "others",
        employer: savedEmployers[0]._id,
        status: "active",
        interested: [savedEmployees[2]._id]
      }
    ];

    const savedPostings = postings.map(posting => {
      const {
        title,
        pay,
        desc,
        req,
        location,
        type,
        commitment,
        employer,
        status,
        interested
      } = posting;
      const newPosting = new Posting({
        title,
        pay,
        desc,
        req,
        location,
        type,
        commitment,
        employer,
        status,
        interested
      });
      return newPosting.save();
    });

    return await Promise.all(savedPostings);
  }

  savePostings()
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = seedDataIfNeeded;
