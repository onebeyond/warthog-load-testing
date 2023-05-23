import { Config } from "../@types/config";

export const defaultConfig: Config = {
  worker: {
    setup: async () => {},
    threads: {
      amount: 1,
      iterations: 1,
    },
  },
  duration: {
    seconds: 1,
  },
};
