const { parentPort, workerData } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');
const { isFunction, isNumber } = require('lodash');

const { getPerformance } = require('../../performance/analysis');

function getTestExports({ setup, test, iterations }) {
    const errors = {
        function: (functionName) => new Error(`"${functionName}" function must be defined`),
        iterations: (invalidIterations) =>
            new Error(`Test iterations "${invalidIterations}" is not valid`)
    };

    if (!isFunction(setup)) {
        throw errors.function('setup');
    }

    if (!isFunction(test)) {
        throw errors.function('test');
    }

    if (!isNumber(iterations)) {
        throw errors.iterations(iterations);
    }

    return {
        setup,
        test,
        iterations
    };
}

async function executeChild() {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const testImport = require(workerData.path);
    const { setup, test, iterations } = getTestExports(testImport);

    await setup();
    parentPort.postMessage({ setupFinished: true });

    let threadIteration = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        let loopIteration = 0;
        // eslint-disable-next-line no-loop-func
        Array.from({ length: iterations }).forEach(async () => {
            loopIteration += 1;
            try {
                const { duration } = await getPerformance({
                    test,
                    iterations: {
                        loopIteration,
                        threadIteration
                    }
                });
                parentPort.postMessage({ iteration: { duration } });
            } catch (error) {
                console.log(error);
                parentPort.postMessage({ iteration: {} });
            }
        });

        // eslint-disable-next-line no-await-in-loop
        await setTimeout(1000);
        threadIteration += 1;
    }
}

module.exports = {
    executeChild
};
