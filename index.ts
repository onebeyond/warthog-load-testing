import { run as workerJobRun } from "./src/worker/job";

export async function stress(func: Function) {
  await workerJobRun(func);
}
