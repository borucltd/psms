const SpotifyStrategy = require('./spotify_strategies/index').Strategy;

const appKey = process.env.APP_KEY ||  '55e1da0fb3c74763b46c5507b68d4ca4'
const appSecret = process.env.APP_SECRET  || 'ce948c0683054e3e8ae9dbb7603f68c9'
const appCallback = process.env.APP_CALLBACK || 'http://localhost:8888/callback'
const spotifyScope = ["user-read-private", "user-read-email", "playlist-read-private"]
const fs = require('fs')
const db = require('../models')


let access_token ;
               

function initialize(passport) {

    // Use the SpotifyStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, expires_in
    //   and spotify profile), and invoke a callback with a user object.
    // 
    passport.use(
        new SpotifyStrategy(
        {
            clientID: appKey,
            clientSecret: appSecret,
            callbackURL: appCallback
        },
        async function(accessToken, refreshToken, expires_in, profile, done) {
            
        // SQL select token
        const existingUser = await db.User.findOne({where: {spotifyId: profile.id}})
        if (existingUser == null) {
            // SQL insert tokens
            db.User.create({
                spotifyId: profile.id,
                username: profile.displayName,
                accessToken: accessToken,
                refreshToken: refreshToken
            })
            .then(function(user) {

                  console.log(user);

            });

        } else {

            // SQL update tokens
            db.User.update({ 
                accessToken: accessToken,
                refreshToken: refreshToken
                }, 
                {
                where: {
                    spotifyId: profile.id
                }
            });
        }         
            
            // console.log("==============> FILE ./config/passport-config.js")
            // console.log("Check if there is user in the table with spotify id and spotify username")
            // console.log("is user exists, we need to run SQL UPDATE and replace access and refresh token")
            // console.log("if user doesn't exist we need run SQL RUN into database")
            // console.log("Work with table users:")
            // console.log("spotify_id" + profile.id)
            // console.log("spotify_username" + profile.displayName)
            // console.log("access_token" + accessToken)
            // console.log("refresh_roken" + refreshToken)
            
            fs.writeFileSync("./tokens.log", JSON.stringify(accessToken), (err) => {
                if (err) throw err;
                console.log("token saved");

            } )
            console.log("==============> FILE ./config/passport-config.js")

            // asynchronous verification, f 
            process.nextTick(function() {
            // To keep the example simple, the user's spotify profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the spotify account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
            });
        }
        )
    );

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session. Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing. However, since this example does not
    //   have a database of user records, the complete spotify profile is serialized
    //   and deserialized.
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(obj, done) {
    done(null, obj);
    });
} 


module.exports =  initialize
