//Defining the strategies

require("dotenv").config();
// Our user model
const { User } = require("../models/schema");
// Defining a local strategy (the email and password)
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (_id, done) {
    User.findById(_id, function (err, user) {
      done(err, user);
    });
  });

  // User login strategy 
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //Find the user associated with the email provided by the user
          User.findOne({ email: email }, function (err, user) {
            if (err) {
              return done(err);
            }
            // If no user is found
            if (!user) {
              return done(null, false, { message: "No user found." });
            }
            // If the user is found but password is invalid
            if (!user.validPassword(password)) {
              return done(null, false, { message: "Oops! Wrong password." });
            // If it passes all checks, login is successful
            } else {
              return done(null, user, { message: "Login successful" });
            }
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
