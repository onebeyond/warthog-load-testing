#! /usr/bin/env node

require('dotenv').config();
const { isMainThread } = require('node:worker_threads');
const { createTestsPools } = require('./parallelism/parent/pool');
const { executeChild: execChildThread } = require('./parallelism/threads/exec');

async function main() {
    if (isMainThread) {
        /**
         * There is only one main thread. This means the following conditional would be executed
         * one single time before creating all the workers.
         */
        createTestsPools();
    } else {
        /**
         * The main thread would had executed all the childs workers with the
         * variable "isMainThread" set to false.
         */
        await execChildThread();
    }
}

main();
