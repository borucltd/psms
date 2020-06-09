// import 
const express = require('express')
const passport = require('passport')
const request = require('request')
const axios = require('axios')
const fs = require('fs')
const db = require('../models')
const moment = require('moment')

// this is important
// access_token is SPECIFIC to the scopes below
const spotifyScope = ["user-read-private", "user-read-email", "playlist-read-private", "playlist-modify-private", "playlist-modify-public" ]
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
    
    // SQL select to find accessToken
    const existingUser = await db.User.findOne({where: {spotifyId: req.user.id}})
    const access_token = existingUser.accessToken

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
        console.log(unique_random_playlists[0].images[0].url)


        res.render('playlists', { user: req.user, playlists: unique_random_playlists  });
        
    })
    .catch(error => console.log('Error', error))
});



// display tracks
router.get('/spotify/search_tracks',   async (req,res) => {
    
    // Get tracks from playlists
    // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

    // GET https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // read access token from the database

    // SQL select to find accessToken
    const existingUser = await db.User.findOne({where: {spotifyId: req.user.id}})
    const access_token = existingUser.accessToken

    const playlists_ids = req.query.playlist;

    // if nothing was selected
    if  (typeof req.query.playlist === 'undefined') {
        // make a message
        res.render('playlists', { user: req.user, message: "No tracks have been selected...what's the go?" });
        
    } else {

        // if user selected some playslists
        // pick up IDs
        // if one playlist is selected
        if (typeof req.query.playlist === "string") {
         
            // if many playlists are selected  
            const tracks = [] 
            let spotify_tracks_url = `https://api.spotify.com/v1/playlists/${req.query.playlist}/tracks`           
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
             
            // render page with tracks 
            //console.log(tracks)  
            res.render('playlists', { user: req.user, spotify_tracks:  tracks });

        } else {   
            // if many playlists are selected
            const playlists_ids = req.query.playlist;      
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
            res.render('playlists', { user: req.user, spotify_tracks:  tracks });
            } 
        }
});

// display playlist from database
router.get('/local/display_playlists',   async (req,res) => {
   
    const existingTracks = await db.User.findOne({where: {spotifyId: req.user.id},include: db.Song })
    const tracks = []
    existingTracks.dataValues.Songs.forEach(element => {
        
        let obj = {
            title: element.title,
            artist: element.artistName,
            uri: element.uri
        }

        tracks.push(obj)
    });
    
    res.render('my-playlists', { user: req.user, localdb_tracks:  tracks });
});


// adds songs to local database
router.post('/spotify/save_tracks', async (req,res) => {

    // console.log(req.body)
    // console.log(req.body.track)

    // first we need to collect user database ID
    const response = await db.User.findOne({where: {spotifyId: req.user.id}})
    const user_id = response.id  
   
    // SQL inserts to find accessToken
    for (key in req.body.titles) {
        let confirmation =  await db.Song.create({ title: req.body.titles[key], artistName: req.body.artists[key], uri: req.body.uris[key] })
        //alert("Songs added")
        // now we need to update another table UserSongs
        // song id confirmation.id
        // user id 
        await db.UserSong.create({ SongId: confirmation.id, UserId: user_id })
        
    }
    // here we need to change some rendering
    //res.status(201).sen
    //res.render('landing',{ message: "Songs were added to the database"})
    res.render('login', { user: req.user });
    

})


// creates playlist in spotify
router.post('/spotify/sync', async (req,res) => {

    console.log(req.query)
    const user_id = req.user.id
    let spotify_playlist_url = `https://api.spotify.com/v1/users/${user_id}/playlists`  

    // SQL select to find accessToken
    const existingUser = await db.User.findOne({where: {spotifyId: req.user.id}})
    const access_token = existingUser.accessToken
    const uris = req.body.uris

    console.log("saving to spotify");

    const playlist_name = "mood" + moment().unix();
    
    console.log("HEEEERE" + playlist_name);
   
    // create playlist mood
    await axios({
        method: 'post',
        url: spotify_playlist_url,
        headers: {"Authorization": "Bearer " + access_token},
       
        data: { name: playlist_name,
                public: "false"
            }
    })
    .then( async (response) => {
        console.log("playlist was created")
        // we need playlist's id PLUS uri for each track
        const playlist_url = `https://api.spotify.com/v1/playlists/${response.data.id}/tracks`
        // console.log(uris.join(','))
        // add tracks to playlist
        await axios({
            method: 'post',
            url: playlist_url,
            headers: {"Authorization": "Bearer " + access_token},
            data: { uris : uris }
        })
        .then(response => {
            console.log("List created")
            res.send(playlist_name);
        })
        .catch(error => console.log('Error', error.response.data))     
    })
    .catch(error => console.log('Error', error.response.data))
})


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
