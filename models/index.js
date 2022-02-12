///MongoDB supports secondary indexes.
///With mongoose, we define these indexes within our Schema
///at the path level or the schema level.
///Defining indexes at the schema level is necessary
///when creating compound indexes.
// mongo database setup
require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB -database login is retrieved from environment variables
///Mongoose lets you start using your models immediately,
///without waiting for mongoose to establish a connection to MongoDB.
///Mongoose supports connecting to MongoDB clusters that require SSL connections.
///The ssl option defaults to true for connection strings that start with mongodb+srv://.
///So if you are using an srv connection string to connect to MongoDB Atlas,
///SSL is enabled by default.
CONNECTION_STRING =
  "mongodb+srv://<username>:<password>@cluster0.yyyc3.mongodb.net/comp30022?retryWrites=true&w=majority";

MONGO_URL = CONNECTION_STRING.replace(
  "<username>",
  process.env.MONGO_USERNAME
).replace("<password>", process.env.MONGO_PASSWORD);

mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "comp30022",
});

const db = mongoose.connection;

/// Handle initial connection errors.
db.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

require("./schema.js");
