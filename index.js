const SERVER = "patientclinic-api";
const PORT = 5000;
const HOST = "127.0.0.1";

const mongoose = require("mongoose");
const username = "zenith";
const password = "zenith123";
const dbname = "patient_group4db";

// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority

let uristring = `mongodb+srv://${username}:${password}@cluster0.i2uby.mongodb.net/${dbname}?retryWrites=true&w=majority`;
// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring);
});

const userSchema = new mongoose.Schema({
  name: String,
  age: String,
});
// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'User' collection in the MongoDB database
let UsersModel = mongoose.model("Users", userSchema);

let errors = require("restify-errors");
let restify = require("restify");

// Create the restify server
let server = restify.createServer({ name: SERVER });

server.listen(PORT, HOST, function () {
  //showing the initializaion in the terminal
  console.log(`Server ${server.name} listening at ${server.url}`);
  console.log("All the available ports:");
  console.log("/patient");
  console.log("/patient/:id");
  if (server.router && server.router.mounts) {
    server.router.mounts.forEach((route) => {
      console.log(
        `${route.spec.path} method: ${Object.keys(route.route.methods).join(
          ", "
        )}`
      );
    });
  }
});
