const { checkForCritical } = require("../misc");

describe("check for critical patient", () => {
  test("if the patient is critical or not", () => {
    const result = checkForCritical(99, 139, 71, 90, 99, 71, 199);
    expect(result).toBe(true);
  });
  test("if the patient is critical or not", () => {
    const result = checkForCritical(99, 139, 71, 90, 96, 63, 21);
    expect(result).toBe(true);
  });
});
