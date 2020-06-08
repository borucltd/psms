$(function() {

    
  // request to backend
  // save spotify tracks to local database
  // selector for button
  $(".submitToDatabase").on("click", function(event) {

    // stop default action
    event.preventDefault()

    // select all checkboxes
    let tracks = $(".saveToDatabase")
    let prefix
    let titles = []
    let artists = []
    let trackIds = []
    // collect title and artist
    for (item of tracks) {
      if (item.checked === true) {
        prefix = item.value
        trackIds.push(prefix);
        titles.push($("."+prefix+"_title").text());
        artists.push($("."+prefix+"_artist").text().replace(/\(|\)/g,""));    
      }
    };

    console.log(ids);
   console.log(titles)
    
    $.ajax({
      method: "POST",
      url: "/spotify/save_tracks",
      data: { trackIds: trackIds, titles: titles, artists: artists }
    })
      .done(function( msg ) {
        alert( "Data Saved: " + msg );
      });
    
});
})
  