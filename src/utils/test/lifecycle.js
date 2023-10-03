const path = require('node:path');
const { isArray, isNumber, isFunction } = require('lodash');
const { isObject } = require('lodash');

const errors = {
    function: (functionName) => new Error(`"${functionName}" function must be defined`)
};

function validateLifecycle(test) {
    return {
        stages: () => {
            const { stages } = test;

            if (isArray(test.stages)) {
                stages.forEach(({ iterations, seconds }) => {
                    if (!isNumber(iterations)) {
                        throw new Error(`Stage "iteration" is not a number "${iterations}"`);
                    }

                    if (!isNumber(seconds)) {
                        throw new Error(`Stage "seconds" is not a number "${seconds}"`);
                    }
                });
            } else {
                throw new Error('Test "stages" is not an array');
            }

            return stages;
        },
        /**
         * This is the first function from the test to be executed.
         * Would ensure that the iterations dependencies have been configured previously.
         * For example if the test is using a Redis client during each iteration this lifecycle
         * would be responsible to init the db client.
         * @returns {Function} must be a function that can be async
         */
        setup: () => {
            const { setup } = test;

            if (!isFunction(test.setup)) {
                throw errors.function('setup');
            }

            return setup;
        },
        /**
         * When the docs refers to the iterations this means the funcion that contains
         * de code being executed and measured for knowing if the system being tested
         * achieves the expected performance.
         * @returns {Function} must be a function that can be async
         */
        test: () => {
            const { test: main } = test;

            if (!isFunction(main)) {
                throw errors.function('test');
            }

            return main;
        },
        /**
         * Another concept being treated on the docs. This time it's the test property
         * that defines the maximum average of time that the iterations can take measured in seconds.
         * If the measured iteration average time is higer that the one defined from there the
         * test output would indicate that it's failed. In the opposite case would mean that the
         * system being tested passed the stress test.
         * @returns {object} must be an opject containing "average" property
         */
        expect: () => {
            const { expect } = test;

            if (!isObject(expect)) {
                throw new Error(`Expect is not an object "${expect}"`);
            }

            return expect;
        }
    };
}

module.exports = {
    validate: {
        byTestPath: (testPath) => {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const test = require(path.resolve(process.env.PWD, testPath));
            return validateLifecycle(test);
        }
    }
};
