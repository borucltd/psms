// import 
const express = require('express')
const passport = require('passport')
const request = require('request')

let token = {}
let user_id = "1alqsafoulc65iwhu1a1taal2"
const spotifyScope = ["user-read-private", "user-read-email", "playlist-read-private"]
const playlistUrl = `https://api.spotify.com/v1/users/${user_id}/playlists/`

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
    // obtain code
    (req,res,next) => {
        console.log(req);
        token = req.query.code; // this is the token code we should use to work with
        next();
    },
    passport.authenticate('spotify', 
    { 
        successRedirect: '/account', // ==> this is our landing page
        failureRedirect: '/login'
    })
);


router.get('/playlists',   (req,res) => {

    // access token
    console.log(passport.access_token);
    



});





module.exports = router
