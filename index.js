const { PatientSchema, RecordSchema, UserSchema } = require("./Schema");
const { checkForCritical } = require("./misc");
const {
  getAllPatient,
  getPatientById,
} = require("./Controller/PatientController");

const SERVER = "patientclinic-api";
const PORT = 3000;
const HOST = "127.0.0.1";

const mongoose = require("mongoose");
const username = "zenith";
const password = "Zenith123";
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

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the collection in the MongoDB database
let PatientModel = mongoose.model("Patient", PatientSchema);
let RecordModel = mongoose.model("Record", RecordSchema);
let UserModel = mongoose.model("User", UserSchema);

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
  console.log("/record");
  console.log("/record/:id");
  console.log("/critical-patient");

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

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// Get all patient in the system
server.get("/patient", getAllPatient);

// Get all patient in the system
server.get("/patient/:id", getPatientById);

//get patient who are critical
server.get("/critical-patient", (req, res, next) => {
  try {
    // Find a single user by their id in db
    PatientModel.find({
      isCritical: true,
    })
      .then((data) => {
        if (data) {
          // Send the user if no issues
          res.send(data);
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404);
        }
        return next();
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

// Create a new patient
server.post("/patient", function (req, res, next) {
  try {
    // validation of manadatory fields
    // let data = JSON.parse(req.body);
    let data = req.body;
    let newPatient = new PatientModel({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      phone: data.phone,
      isCritical: false,
    });

    // Create the user and save to db
    newPatient
      .save()
      .then((data) => {
        // Send the user if no issues
        if (data) {
          res.send(200, {
            message: "Patient Created Successfully",
            data: data,
          });
        } else {
          res.send(404, "Error");
        }

        return next();
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

// Delete patient with the given id
server.del("/patient/:id", function (req, res, next) {
  const id = req.params.id;
  try {
    // Delete the user in db
    PatientModel.findOneAndDelete({ _id: id })
      .then((data) => {
        if (data) {
          RecordModel.deleteMany({
            recordOf: id,
          }).then(() => {
            res.send(200, "Deleted");
            return next();
          });
        } else {
          res.send(404, "User not found");
        }
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

// create a record
server.post("/record", (req, res, next) => {
  try {
    // let data = JSON.parse(req.body);
    let data = req.body;
    //checking for critical
    const criticalStatus = checkForCritical(
      data.diastolicBloodPressure,
      data.systolicBloodPressure,
      data.bloodOxygenLevel,
      data.heartbeatRate,
      data.respiratoryRate
    );
    let newRecord = new RecordModel({
      recordTitle: data.recordTitle,
      recordOf: data.patientId,
      recordBy: data.userId,
      date: data.date,
      bloodOxygenLevel: data.bloodOxygenLevel,
      respiratoryRate: data.respiratoryRate,
      systolicBloodPressure: data.systolicbloodPressure,
      diastolicBloodPressure: data.diastolicbloodPressure,
      heartbeatRate: data.heartbeatRate,
      recordSummary: data.recordSummary,
      isCritical: criticalStatus,
    });
    newRecord
      .save()
      .then((val) => {
        PatientModel.findByIdAndUpdate(
          { _id: data.patientId },
          {
            $push: { records: val },
            isCritical: criticalStatus,
          },
          { new: true }
        )
          .then(() => {
            UserModel.findByIdAndUpdate(
              { _id: data.userId },
              {
                $push: { records: val },
                isCritical: criticalStatus,
              },
              { new: true }
            )
              .then(() => {
                res.send(200, {
                  message: "Record Inserted Successfully",
                });
              })
              .catch((error) => {
                return next(new Error(JSON.stringify(error.errors)));
              });
          })
          .catch((error) => {
            return next(new Error(JSON.stringify(error.errors)));
          });
      })
      .catch((err) => {
        console.log("error: " + err);
        return next(new Error(JSON.stringify(err.errors)));
      });
  } catch (error) {
    throw error;
  }
});

//get record
server.get("/record", (req, res, next) => {
  try {
    RecordModel.find({})
      .then((data) => {
        // Return all of the users in the system
        res.send(data);
        return next();
      })
      .catch((error) => {
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

//get single record
server.get("/record/:id", (req, res, next) => {
  try {
    // Find a single user by their id in db
    RecordModel.findOne({ _id: req.params.id })
      .then((data) => {
        if (data) {
          // Send the user if no issues
          res.send(data);
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404);
        }
        return next();
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

// Delete record with the given id
server.del("/record/:id", function (req, res, next) {
  try {
    // Delete the user in db
    RecordModel.findOneAndDelete({ _id: req.params.id })
      .then((data) => {
        if (data) {
          res.send(200, "Deleted");
        } else {
          res.send(404, "Record not found");
        }
        return next();
      })
      .catch((error) => {
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

///create a user
server.post("/user", (req, res, next) => {
  try {
    // let data = JSON.parse(req.body);
    let data = req.body;
    //checking for critical

    let newUser = new UserModel({
      username: data.username,
      password: data.password,
      userType: data.userType,
    });
    newUser
      .save()
      .then((data) => {
        // Send the user if no issues
        if (data) {
          res.send(200, {
            message: "User Created Successfully",
            data: data,
          });
        } else {
          res.send(404, "Error");
        }

        return next();
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

//get record
server.get("/user", (req, res, next) => {
  try {
    UserModel.find({})
      .then((data) => {
        // Return all of the users in the system
        res.send(data);
        return next();
      })
      .catch((error) => {
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

//get single record
server.get("/user/:id", (req, res, next) => {
  try {
    // Find a single user by their id in db
    UserModel.findOne({ _id: req.params.id })
      .then((data) => {
        if (data) {
          // Send the user if no issues
          res.send(data);
        } else {
          // Send 404 header if the user doesn't exist
          res.send(404);
        }
        return next();
      })
      .catch((error) => {
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

// Delete record with the given id
server.del("/user/:id", function (req, res, next) {
  try {
    // Delete the user in db
    UserModel.findOneAndDelete({ _id: req.params.id })
      .then((data) => {
        if (data) {
          res.send(200, "Deleted");
        } else {
          res.send(404, "Record not found");
        }
        return next();
      })
      .catch((error) => {
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});

//login function
server.post("/login", function (req, res, next) {
  try {
    let data = JSON.parse(req.body);
    // let data = req.body;
    const { username, password } = data;
    console.log(username, password);
    if (!username || !password) {
      return res.send(400, {
        message: "Please insert the data",
      });
    }

    UserModel.findOne({
      username: username,
    })
      .then((data) => {
        if (data) {
          console.log(data, "here");
          res.send(200, {
            data: data,
            message: "User Logged In",
          });
        } else {
          console.log(data, "here2");
          res.send(404, {
            message: "User not found.",
          });
        }
        return next();
      })
      .catch((error) => {
        return next(new Error(JSON.stringify(error.errors)));
      });
  } catch (error) {
    throw error;
  }
});
