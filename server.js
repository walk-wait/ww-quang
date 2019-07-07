const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const passport = require("./config/passport/passport");
const session = require("express-session");
// const cookieParser = require('cookie-parser');
// let MemoryStore = require('session-memory-store')(session);
const db = require("./models" );
// const binomialProbability = require("binomial-probability");

const PORT = process.env.PORT || 3001;

// Define middleware here
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Add routes, both API and view

// app.use(routes);

// Requiring our routes
// require("./routes/html-routes.js")(app);
require("./routes/api/auth.js")(app);
//
// Start the API server, true drop the db and create automatically 
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = false;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  API Server now listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});