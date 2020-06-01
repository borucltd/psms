// import 
const express = require('express')
const passport = require('passport')
const request = require('request')
const axios = require('axios')
const fs = require('fs')

// variables
// The unique string identifying the Spotify category.
const category_id = "mood"
const spotify_category_playlists = `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`

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
        successRedirect: '/landing', // ==> this is our landing page
        failureRedirect: '/login'
    })
);

// display playlists
router.get('/spotify/search_playlists',  async (req,res) => {
    
    // Get a Category's Playlists
    // https://developer.spotify.com/documentation/web-api/reference/browse/get-categorys-playlists/

    // https://api.spotify.com/v1/browse/categories/{category_id}/playlists
    // read access token from the database
    const raw_access_token = fs.readFileSync("./tokens.log")
    const access_token = JSON.parse(raw_access_token);
    // axios returns a promise
    axios({
        method: 'get',
        url: spotify_category_playlists,
        headers: {"Authorization": "Bearer " + access_token},
        params: { limit: 10}
    })
    .then(response => {
        console.log(response.data.playlists.items)
        res.render('landing', { user: req.user, playlists: response.data.playlists.items  });
        
    })
    .catch(error => console.log('Error', error))
});


// display tracks
router.get('/spotify/search_tracks',   async (req,res) => {
    
    // Get tracks from playlists
    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

    // GET https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // read access token from the database
    const raw_access_token = fs.readFileSync("./tokens.log")
    const access_token = JSON.parse(raw_access_token);

    const playlists_ids = req.query.playlist;
    // we need spotify ID
    if  (!req.query) {
        playlists_ids = 'Nothing selected'
        
    } else {
        const playlists_ids = req.query.playlist;
    }
    
    const tracks = []

    for (playlist_id of playlists_ids) {

        let spotify_tracks_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
        

    // axios returns a promise
    await axios({
        method: 'get',
        url: spotify_tracks_url,
        headers: {"Authorization": "Bearer " + access_token},
        params: { limit: 10}
    })
    .then(response => {
        console.log(response.data.items)
        tracks.push(response.data.items[0])
        tracks.push(response.data.items[1])
        tracks.push(response.data.items[2])
        tracks.push(response.data.items[3])
        tracks.push(response.data.items[4])
        
    })
    .catch(error => console.log('Error', error))
       
    }    

    

    
    res.render('landing', { user: req.user, spotify_tracks:  tracks });

    



  
});




module.exports = router
