const express = require('express')
const session = require('express-session')
const passport = require('passport')
const consolidate = require('consolidate')
const swig = require('swig')
const initializePassport = require('./config/passport-config')

// initialize passport for Spotify
initializePassport(passport);


const PORT = process.env.PORT || 8888
const sessionSecret = process.env.SESSION_SECRET || 'whatever'

// this should go to ENV or should remain here... not sure what we will collect from Spotify
const spotifyScope = "playlist-read-private"

// create express
const app = express();

// defined template for express => ejs
app.set('view engine','ejs')
app.engine('html', consolidate.swig);
//app.use(express.urlencoded({ extended: false}))

// enable sessions handling by express
app.use(session({ 
  secret: sessionSecret, 
  resave: true,                   // should be false not sure yet
  saveUninitialized: true }));    // should be false not sure yet

// enable passport as middleware in express
app.use(passport.initialize());
app.use(passport.session());

// default static content is in public
app.use(express.static(__dirname + '/public'));


// routes should go to CONTROLLERS
app.get('/', function(req, res) {
  res.render('index.html', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res) {
  console.log(req.accessToken)
  res.render('account.html', { user: req.user });
});

app.get('/playlists', ensureAuthenticated, function(req, res) {
  console.log(req.accessToken)
  res.render('playlists.html', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login.html', { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: spotifyScope,
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback',
  passport.authenticate('spotify', 
  { 
    successRedirect: '/account',
    failureRedirect: '/login'
  })
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// start express

app.listen(PORT,  function() {
  // Log (server-side) when our server has started
  console.log("Server listening on port " + PORT);
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
// isAuthenticated is in-built function from passport
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function ensureIsNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/login');
  }
    next()
}



