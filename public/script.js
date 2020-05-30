$(function() {

    $(".login").on("click", function(event) {
         // take these from backend
        const client_id = "55e1da0fb3c74763b46c5507b68d4ca4";
        const secret = "ce948c0683054e3e8ae9dbb7603f68c9";
        const redirect_uri = "https://lnxsa.com/";
        const encoded_redirect_uri=redirect_uri.replace(/:/g,'%3A').replace(/\//g,'%2F');
        const spotify_url =  "https://accounts.spotify.com/authorize";
        // this can be randomized
        const state="mariusz";
        // these can be taken from website
        const scope = "playlist-read-private";
        console.log("LOGIN");

        let authorize_url=`${spotify_url}?client_id=${client_id}&response_type=code&redirect_uri=${encoded_redirect_uri}&scope=${scope}$state=${state}`;
        // STEP 1 connect to spotify
        $.ajax(authorize_url, {
          type: "GET",
        }).then(
          function(result) {
            console.log(result);
         }
        );
  
    });
});


  