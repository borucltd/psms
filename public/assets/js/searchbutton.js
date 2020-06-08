
//search bar stuff


    // console.log("hello?");


$("#schbtn").on("click", function(event) {

    event.preventDefault()
  
    let search = $("#schinp").val();
    
    // console.log("search" + search);
  
    
    $.ajax({
      method: "GET",
      url: "/local/search_for_playlists",
      data: {search}
    })
      .done(function( msg ) {
        // alert( "Data Saved: " + msg );
      });
});
