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
});

const client_id = "55e1da0fb3c74763b46c5507b68d4ca4";
const secret = "ce948c0683054e3e8ae9dbb7603f68c9";


  