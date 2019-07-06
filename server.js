const express = require("express");
const routes = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require('cookie-parser');
let MemoryStore = require('session-memory-store')(session);
const db = require("./models" );
// const binomialProbability = require("binomial-probability");

const PORT = process.env.PORT || 3001;

// for body parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Connect to passport
  //CODE HERE ---
app.use(session({
  secret: "keyboard",
  resave: true,
  saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session()); //login persistence

// sync db
db.sequelize.sync().then(function() {
  console.log("database done!")
}).catch(function(err) {
  console.log(err, "database is wrong!")
})

// Requiring our routes
require("./routes/htmlroutes")(app);
require("./routes/apiroutes")(app);


// Start the API server, true drop the db and create automatically 
var syncOptions = { force: true };

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