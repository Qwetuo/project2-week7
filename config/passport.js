const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const Admin = require("../models/admin");
const Employee = require("../models/employee");
const Employer = require("../models/employer");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  let user = await Employee.findOne({ _id: jwt_payload.id });
  if (!user) {
    user = await Employer.findOne({ _id: jwt_payload.id });
  }
  if (!user) {
    user = await Admin.findOne({ _id: jwt_payload.id });
  }

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(jwtStrategy);

module.exports = {
  passport,
  jwtOptions
};
