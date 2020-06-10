$(function() {

    // make request to backend
    $(".login").on("click", function(event) {

        $.ajax("/authorize_spotify", {
            type: "GET",
          }).then(
            function(result) {
                console.log(result);
            }
          );
  
    });

    $(".submitToDatabase").on("click", function(event) {

      // stop default action
      event.preventDefault()
      // select all checkboxes
      let tracks = $(".saveToDatabase")
      let prefix
      let titles = []
      let artists = []
      let uris = []
      // collect title and artist
      for (item of tracks) {
        if (item.checked === true) {
          prefix = item.value;
          titles.push($("."+prefix+"_title").text());
          artists.push($("."+prefix+"_artist").text().replace(/\(|\)/g,""));    
          uris.push(item.name);
        }
      };
      //console.log(ids);
      console.log(uris)
     console.log(titles)
      $.ajax({
        method: "POST",
        url: "/spotify/save_tracks",
        data: { titles: titles, artists: artists, uris: uris }
      })
        .done(function( msg ) {
          location.replace("/local/display_playlists");
       
        });
      });


      $(".submitToSpotify").on("click", function(event) {

        // stop default action
        event.preventDefault()
        // select all checkboxes
        let tracks = $(".saveToSpotify")
        let prefix
        let uris = []
        // collect uri for each track
        for (item of tracks) {
          if (item.checked === true) {
            uris.push(item.name);
          }
        };
        //console.log(ids);
       
        $.ajax({
          method: "post",
          url: "/spotify/sync",
          data: { uris: uris }
        })
          .done(function( msg ) {
            alert("Playlist was created " + msg);
          });
        });
  



});
