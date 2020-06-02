// import 
const express = require('express')
const passport = require('passport')
const request = require('request')
const axios = require('axios')
const fs = require('fs')

// this is important
// access_token is SPECIFIC to the scopes below
const spotifyScope = ["user-read-private", "user-read-email", "playlist-read-private"]
// this variable will be updated when callback redirections happens
// next it will be used to make queries with DB
let user_id

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
    // update data about the user
    (req,res,next) => {
        token = req.query.code; // this is the token code we should use to work with
        user_id = req.query.id
        display_name = req.query.displayName
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
    const category_id = "mood"
    const spotify_category_playlists = `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`
    console.log("START: READ from database here => file ./controllers/spotify.js")
    console.log("We need to get access_token using SQL SELECT")
    console.log("Spotify ID:" + req.user.id) 
    console.log("END: READ from database here => file ./controllers/spotify.js")
    const raw_access_token = fs.readFileSync("./tokens.log")
    const access_token = JSON.parse(raw_access_token);
    // axios returns a promise
    axios({
        method: 'get',
        url: spotify_category_playlists,
        headers: {"Authorization": "Bearer " + access_token},
        params: { limit: 50}
    })
    .then(response => {
        // choose 10 random playlists
        const random_playlists = randomizeArray(response.data.playlists.items,10)
        // remove duplicates if any
        const unique_random_playlists = [... new Set(random_playlists)]
        // redner the landing page with user and playlist data
        res.render('landing', { user: req.user, playlists: unique_random_playlists  });
        
    })
    .catch(error => console.log('Error', error))
});



// display tracks
router.get('/spotify/search_tracks',   async (req,res) => {
    
    // Get tracks from playlists
    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

    // GET https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // read access token from the database
    console.log(`HEEEEEEEEEEEEEERE ${req.user.id}`)
    const playlistUrl = `https://api.spotify.com/v1/users/${req.user.id}/playlists/`
    console.log("START: READ from database here => file ./controllers/spotify.js")
    console.log("We need to get access_token using SQL SELECT")
    console.log("Spotify ID:" + req.user.id) 
    console.log("END: READ from database here => file ./controllers/spotify.js")
    const raw_access_token = fs.readFileSync("./tokens.log")
    const access_token = JSON.parse(raw_access_token);
    const playlists_ids = req.query.playlist;

    // if nothing was selected
    if  (typeof req.query.playlist === 'undefined') {
        // make a message
        res.render('landing', { user: req.user, message: 'Nothing selected, try again.' });
        
    } else {

        // if user selected some playslists
        // pick up IDs
        const playlists_ids = req.query.playlist;

        const tracks = []

        for (playlist_id of playlists_ids) {

            console.log(playlist_id)

            let spotify_tracks_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`           
            // axios returns a promise
            await axios({
                method: 'get',
                url: spotify_tracks_url,
                headers: {"Authorization": "Bearer " + access_token},
                params: { limit: 10}
            })
            .then(response => {
                const random_tracks = randomizeArray(response.data.items,10)
                const unique_random_playlists = [... new Set(random_tracks)]
                const unique_random_tracks = [... new Set(unique_random_playlists)]
                // collect tracks data only
                for (value of unique_random_tracks ) {
                    //console.log(value.artists)
                    tracks.push(value)
                }
            
                // console.log(JSON.parse(response.data.items))
            })
            .catch(error => console.log('Error', error.response.data))
        } 
        // render page with tracks 
        //console.log(tracks)  
        res.render('landing', { user: req.user, spotify_tracks:  tracks });
        } 
});

// display playlist from database
router.get('/local/display_playlists',   async (req,res) => {

    console.log("START: READ from database here => file ./controllers/spotify.js")
    console.log("We need to get all tracks for the user SQL SELECT and .. INNER JOIN")
    console.log("Use user spotify id" + user_id + "global variable ready to be used")
    console.log("Tracks need to in JSON format, each track: title and artist")
    console.log("END: READ from database here => file ./controllers/spotify.js")
    tracks = [ 
            {
                "title":"Battery",
                "artist":"Metallica"
            }, 
            {
                "title":"Teardrop",
                "artist":"Jose Gonzalez"
            } 
        ]
    res.render('landing', { user: req.user, localdb_tracks:  tracks });
});

// save OR update database with new songs
router.post('/local/display_playlists',   async (req,res) => {
    console.log("START: READ from database here => file ./controllers/spotify.js")
    console.log("We need to get access_token using SQL SELECT")
    console.log("Spotify ID:" + req.user.id) 
    console.log("END: READ from database here => file ./controllers/spotify.js")

    console.log("writing to databse")
    res.status(200)
});


// function which selects random elements from the array
function randomizeArray(array,size) {
    
    const output_array = []

    if (array.length > 0 ) {
        for (i=0; i<size; i++) {
            random_index = Math.floor(Math.random()*(array.length))
            output_array.push(array[random_index])
        }
    } else {
        throw "This is not an array"
    } 

    return output_array

}

module.exports = router
