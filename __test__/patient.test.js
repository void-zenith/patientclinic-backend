const { checkForCritical } = require("../misc");

describe("check for critical patient", () => {
  test("if the patient is critical or not", () => {
    const result = checkForCritical(89, 139, 69, 99, 95, 60, 20);
    expect(result).toBe(true);
  });
  test("if the patient is critical or not", () => {
    const result = checkForCritical(89, 139, 69, 99, 95, 60, 20);
    expect(result).toBe(true);
  });
});
