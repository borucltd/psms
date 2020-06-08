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
      // collect title and artist
      for (item of tracks) {
        if (item.checked === true) {
          prefix = item.value
          titles.push($("."+prefix+"_title").text());
          artists.push($("."+prefix+"_artist").text().replace(/\(|\)/g,""));    
        }
      };
      //console.log(ids);
     console.log(titles)
      $.ajax({
        method: "POST",
        url: "/spotify/save_tracks",
        data: { titles: titles, artists: artists }
      })
        .done(function( msg ) {
          location.replace("/local/display_playlists");
       
        });
      });


      $(".submitToSpotifytabase").on("click", function(event) {

        // stop default action
        event.preventDefault()
        // select all checkboxes
        let tracks = $(".saveToSpotify")
        let prefix
        let titles = []
        let artists = []
        // collect title and artist
        for (item of tracks) {
          if (item.checked === true) {
            prefix = item.value
            titles.push($("."+prefix+"_title").text());
            artists.push($("."+prefix+"_artist").text().replace(/\(|\)/g,""));    
          }
        };
        //console.log(ids);
       console.log(titles)
        $.ajax({
          method: "GET",
          url: "/spotify/sync",
          data: { titles: titles, artists: artists }
        })
          .done(function( msg ) {
            location.replace("/local/display_playlists");
          });
        });
  



});
