const checkForCritical = (
  diastolicBloodPressure,
  systolicBloodPressure,
  bloodOxygenLevel,
  hearbeatRate,
  respiratoryRate
) => {
  console.log(systolicBloodPressure <= 90);
  console.log(systolicBloodPressure >= 140);
  console.log(diastolicBloodPressure <= 70);
  console.log(diastolicBloodPressure >= 91);
  console.log(bloodOxygenLevel < 95);
  console.log(hearbeatRate <= 60);
  console.log(respiratoryRate <= 20);

  if (
    systolicBloodPressure <= 90 ||
    systolicBloodPressure >= 1540 ||
    diastolicBloodPressure <= 60 ||
    diastolicBloodPressure >= 91 ||
    bloodOxygenLevel < 95 ||
    hearbeatRate <= 60 ||
    respiratoryRate <= 19
  ) {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
};

module.exports = {
  checkForCritical,
};
