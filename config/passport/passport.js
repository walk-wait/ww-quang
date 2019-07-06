// import passport for user authentication
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

// need model to check passport again
var db = require("../../models");

passport.use(new LocalStrategy(
    // sign in with email, rather than a "username" 
    // (will discuss with group mate)
    {
      usernameField: "email"
    },
    function(email, password, done) {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          email: email
        }
      }).then(function(dbUser) {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  ));
  //
  // In order to help keep authentication state across HTTP requests,
  // Sequelize needs to serialize + deserialize the users
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  //
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  //
  // Exporting our configured passport
  module.exports = passport;