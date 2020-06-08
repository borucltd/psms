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



});

// search bar - artist search  

// find template and compile it
// var templateSource = document.getElementById('results-template').innerHTML,
//   template = Handlebars.compile(templateSource),
//   resultsPlaceholder = document.getElementById('results'),
//   playingCssClass = 'playing',
//   audioObject = null;

// var fetchTracks = function(albumId, callback) {
//   $.ajax({
//     url: 'https://api.spotify.com/v1/albums/' + albumId,
//     success: function(response) {
//       callback(response);
//     }
//   });
// };

// var searchAlbums = function(query) {
//   $.ajax({
//     url: 'https://api.spotify.com/v1/search',
//     data: {
//       q: query,
//       type: 'album'
//     },
//     success: function(response) {
//       resultsPlaceholder.innerHTML = template(response);
//     }
//   });
// };
