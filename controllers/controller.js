/* controller contains all functions that access and manipulate the database
    this is where requests from frontend are actually executed  */

const mongoose = require("mongoose");
const passport = require("passport");
require("../config/passport")(passport);

const User = mongoose.model("User");
const Contact = mongoose.model("Contact");

// Adds a new user if the user does not already have an account
const signUp = async (req, res, next) => {
  try {
    User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) throw err;
      // If the user already exists in the database
      if (user) {
        const error = new Error("User already exists");
        return next(error);
      }
      // If the user is a new user, we add their details to the user database
      if (!user) {
        var newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.contacts = [];
        /// Each document can be saved to the database
        /// by calling its save method.
        /// The first argument to the callback will be
        /// an error if any occurred.
        /// await fluffy.save();
        await newUser.save();
        res.send("user created");
      }
    });
  } catch (error) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// checks that the user's email and password database and returns the user's username.
const login = async (req, res, next) => {
  // using passport login strategy to authenticate user.
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error(info.message);
        return next(error);
      }
      const username = user.username;
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        res.status(200);
        return res.json({ username: username });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

// Adds a contact to the user's contacts
const addContact = async (req, res, next) => {
  try {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "/" + month + "/" + year;
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.contactEmail,
      number: req.body.number,
      dateAdded: dateStr,
      tags: req.body.tags,
      comments: req.body.comments,
    });
    // Saves the new contact to the database
    newContact.save((err, result) => {
      if (err) console.log(err);
      return res.json(result);
    });

    //find user by email and add the new contact to the user
    await User.findOneAndUpdate(
      { email: req.body.userEmail },
      ///By default, Mongoose adds an _id property to schemas.
      ///When you create a new document with the automatically added _id property,
      ///Mongoose creates a new _id of type ObjectId to your document.
      { $push: { contacts: newContact._id } }
    );
    return res.status(200);
  } catch (error) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// finds all contacts associated with the user who's email is provided.
const homePage = async (req, res, next) => {
  console.log("CONTACTED BACKEND");
  console.log(req.query);

  try {
    const user = await User.findOne({ email: req.params.email });
    /// const kittens = await Kitten.find();
    const userContacts = await Contact.find({
      _id: { $in: user.contacts },
    });
    return res.json({ contacts: userContacts });
  } catch (error) {
    res.status(400);
    return res.send("Database query failed");
  }
};

const editContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.body._ID },
      {
        name: req.body.name,
        email: req.body.contactEmail,
        number: req.body.number,
        tags: req.body.tags,
        comments: req.body.comments,
      }
    );
  } catch (error) {
    res.status(400);
    return res.send("Database query failed");
  }
};

//exports the functions
module.exports = {
  signUp,
  login,
  addContact,
  homePage,
  editContact,
};
