// import 
const express = require('express')


// define router
const router = express.Router()

// Define TWO middleware functions
// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
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

// define routes 
// if you want to secure a route use middleware function ensureAuthenticated
// if you want to make sure route doesn't need to be secure use middleware function ensureIsNotAuthenticated
// here we add more routes..

router.get('/', function(req, res) {  
    res.render('login',  { user: req.user });
  }); 
  
router.get('/landing', ensureAuthenticated, function(req, res) {
    res.render('landing', { user: req.user });
});

router.get('/login', function(req, res) {
    res.render('login', { user: req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
  
module.exports = router
