const { isArray, isNumber, isFunction } = require('lodash');

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
        setup: () => {
            const { setup } = test;

            if (!isFunction(test.setup)) {
                throw errors.function('setup');
            }

            return setup;
        },
        test: () => {
            const { test: main } = test;

            if (!isFunction(main)) {
                throw errors.function('test');
            }

            return main;
        }
    };
}

module.exports = {
    validate: {
        byTestPath: (testPath) => {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const test = require(testPath);
            return validateLifecycle(test);
        }
    }
};
