import { stress } from "../index";

describe("stress", () => {
  it("should execute provided function", async () => {
    expect(process.env.TEST_FUNCTION_EXECUTED).toBeUndefined();

    const testFunction = async () => {
      process.env.TEST_FUNCTION_EXECUTED = "executed";
    };
    await stress(testFunction);

    expect(process.env.TEST_FUNCTION_EXECUTED).toBe("executed");
  });
});
