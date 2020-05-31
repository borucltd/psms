const express = require('express')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const consolidate = require('consolidate')
const swig = require('swig')

// import configuration function for passport (it contains predefined strategy for Spotify)
const initializePassport = require('./config/passport-config')
initializePassport(passport);



// defaults for express
const PORT = process.env.PORT || 8888
const sessionSecret = process.env.SESSION_SECRET || 'whatever'

// create express
const app = express()

// configure express
app.engine('handlebars',exphbs({defaultLayout: "main"}))
app.set('view engine','handlebars')

app.use(session({               
  secret: sessionSecret,          // each session will be secured with secret, it should be random string
  resave: true,                   // should be false not sure yet
  saveUninitialized: true }))     // should be false not sure yet
app.use(passport.initialize())    // add middleware function
app.use(passport.session())       // add middleware function
app.use(express.static(__dirname + '/public')); // root directory for statuc content (images, js scripts, non-template html)

// import routes and give the server access to them.
const spotify_routes = require("./controllers/spotify");
const routes = require("./controllers/routes");
app.use(spotify_routes);
app.use(routes);

// start express
app.listen(PORT,  function() {
  console.log("Server listening on port " + PORT)
})
