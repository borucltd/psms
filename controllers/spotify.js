// import 
const express = require('express')
const passport = require('passport')
const spotifyScope = "playlist-read-private"
// define router
const router = express.Router()

// this will run passport.authenticate which internally will request Spotify authorize www,
// next, Spotify authorize will REDIRECT user to the website defined as "redirect URI" in Spotify application
router.get(
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
  
// this route works when Spotify redirect users to "redirect URI"
// our "redirect URI" contains "/callback" as the last part of the address 
// once express receives GET for "/callback" it will run passport internal middleware function which
// checks if user is authenticated or not. If it is user will be redirected to "/account" page, if not this will be "/login"
router.get('/callback',
passport.authenticate('spotify', 
{ 
    successRedirect: '/account', // ==> this is our landing page
    failureRedirect: '/login'
})
);


module.exports = router
