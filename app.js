const express = require("express");
const PORT =  process.env.PORT || 8080;
const router = express.Router();
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



/// =========================

// first route for GET
router.get("/", function(req, res) {
  console.log("Serving main page.");
    
      res.sendFile("index");
    });






// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
