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
  