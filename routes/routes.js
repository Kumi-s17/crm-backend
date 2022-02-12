// Creates an Express application.
/// The express() function is a top-level function exported by the express module
const express = require("express");

// add our router
/// Routing refers to determining how an application responds to a client request to a particular endpoint,
/// which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
const router = express.Router();

// router passes information to controller which calls appropriate function
const controller = require("../controllers/controller.js");

// all functions in api.js (frontend) must have a match here defined below
///POST is used to send data to a server to create/update a resource.
router.post("/signup", controller.signUp);
router.post("/login", controller.login);
router.post("/addContact", controller.addContact);
///GET is used to request data from a specified resource.
///GET is one of the most common HTTP methods.
///GET requests should never be used when dealing with sensitive data
///GET requests are only used to request data (not modify)
router.get("/homePage/:email", controller.homePage);
router.post("/editContact", controller.editContact);
//export the router
module.exports = router;
