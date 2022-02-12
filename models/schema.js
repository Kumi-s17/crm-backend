// define all of our database schemas

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

// define User schema
///With Mongoose, everything is derived from a Schema.
///Everything in Mongoose starts with a Schema.
///Each schema maps to a MongoDB collection
///and defines the shape of the documents within that collection.
///Schema with properties
const userSchema = new mongoose.Schema({
  ///Each key in our code Schema defines a property in our documents
  ///which will be cast to its associated SchemaType.
  ///For example, we've defined a property email
  ///which will be cast to the String SchemaType
  ///Notice above that if a property only requires a type,
  ///it can be specified using a shorthand notation.
  ///There are a list of permitted SchemaTypes
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, default: undefined },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
});

// method for generating a hash; used for password hashing
///Functions added to the methods property of a schema
///get compiled into the Model prototype
///and exposed on each document instance
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// define Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  number: { type: String },
  dateAdded: { type: String },
  tags: [{ type: String }],
  comments: { type: String },
});

///Compiling our schema into a Model.
///A model is a class with which we construct documents.
///To use our schema definition,
///we need to convert our Schema into a Model we can work with.
///Pass it into mongoose.model(modelName, schema)
const User = mongoose.model("User", userSchema);
const Contact = mongoose.model("Contact", contactSchema);

// make models available to other files
module.exports = { User, Contact };
