import { stress } from "../index";

describe("stress", () => {
  it("should execute provided function", async () => {
    await stress({
      worker: {
        setup: async () => {
          return "Jest test!";
        },
        threads: {
          amount: 2,
          iterations: 2,
        },
      },
    });
  });
});
