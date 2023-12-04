const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  phone: String,
  isCritical: Boolean,
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }],
});

const RecordSchema = new mongoose.Schema({
  date: String,
  recordTitle: String,
  systolicBloodPressure: String,
  diastolicBloodPressure: String,
  respiratoryRate: String,
  bloodOxygenLevel: String,
  heartbeatRate: String,
  recordSummary: String,
  isCritical: Boolean,
  recordOf: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  recordBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  userType: String,
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }],
});
module.exports = {
  PatientSchema,
  RecordSchema,
  UserSchema,
};
