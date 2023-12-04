const mongoose = require("mongoose");
const { PatientSchema, RecordSchema, UserSchema } = require("../Schema");
let PatientModel = mongoose.model("Patient", PatientSchema);

const getAllPatient = (req, res, next) => {
  try {
    PatientModel.find({})
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
};
r;

const getPatientById = (req, res, next) => {
  try {
    // Find a single user by their id in db
    PatientModel.findOne({ _id: req.params.id })
      .populate("records")
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
};

module.exports = {
  getAllPatient,
  getPatientById,
};
