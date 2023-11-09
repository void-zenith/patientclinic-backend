const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }],
});

const RecordSchema = new mongoose.Schema({
  date: String,
  recordTitle: String,
  bloodPressure: String,
  respiratoryRate: String,
  bloodOxygenLevel: String,
  heartbeatRate: String,
  recordSummary: String,
  recordOf: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

module.exports = {
  PatientSchema,
  RecordSchema,
};
