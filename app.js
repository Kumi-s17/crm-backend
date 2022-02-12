/* 
  Entry point for program. General structure is:
    - incoming requests will be received by router (defined below)
    - router will call the controller function that matches request URL
    - controller function will execute, accessing DB as required (either
      changing data for "POST" requests, or sending data back to front end
      for "GET requests")
*/

// packages our server will use
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// enable requests from react app which runs on "http://localhost:3000"
app.use(
  cors({
    credentials: true,
    origin: "https://comp30022-frontend.herokuapp.com/",
    //origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./models");

// router is responsible for coordinating incoming requests
const router = require("./routes/routes");
app.use("/", router);

app.get("/", (req, res) => {
  res.send("<h1>galactic enterprises server</h1>");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("The app server is running");
});
