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

      console.log('HEERE')
      let tracks = $(".saveToDatabase").val()

      console.log(tracks)
      $.ajax("/spotify/save_tracks", {
          type: "POST",

        }).then(
          function(result) {
              console.log("Saved to DB");
          }
        );

  });



});

// search bar - artist search  

// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
  template = Handlebars.compile(templateSource),
  resultsPlaceholder = document.getElementById('results'),
  playingCssClass = 'playing',
  audioObject = null;

var fetchTracks = function(albumId, callback) {
  $.ajax({
    url: 'https://api.spotify.com/v1/albums/' + albumId,
    success: function(response) {
      callback(response);
    }
  });
};

var searchAlbums = function(query) {
  $.ajax({
    url: 'https://api.spotify.com/v1/search',
    data: {
      q: query,
      type: 'album'
    },
    success: function(response) {
      resultsPlaceholder.innerHTML = template(response);
    }
  });
};
