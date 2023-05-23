import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
  SHARE_ENV,
} from "node:worker_threads";
import { writeFile } from "fs/promises";

import { Config } from "../@types/config";

import { defaultConfig } from "../utils/config";

function getWorker(): Worker {
  return new Worker("./src/worker/worker.js", {
    env: SHARE_ENV,
    workerData: {
      path: "./pool.ts",
    },
  });
}

let globalSetup: Function;

export async function create() {
  if (isMainThread) {
    const config: Config = defaultConfig;
    const threads: Worker[] = [];
    process.env.WORKER_CREATE_CHILD_THREADS = "yes";
    globalSetup = config.worker.setup;

    for (let thread = 0; thread < config.worker.threads.amount; thread++) {
      threads.push(getWorker());
    }

    threads.forEach((worker) => {
      worker.once("message", (result) => {
        console.info(result);
      });

      worker.on("error", (error) => {
        console.error(error);
      });

      worker.on("exit", (exitCode) => {
        console.error(exitCode);
      });
    });
  } else {
    console.log(process.env.WORKER_CREATE_CHILD_THREADS);
    // const setupResult = await workerData.setup();
    const setupResult = await writeFile("/tmp/jest.md", "test", "utf-8");
    parentPort?.postMessage(setupResult);
  }
}

if (process.env.WORKER_CREATE_CHILD_THREADS) {
  create();
}
