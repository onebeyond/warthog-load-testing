const { isArray, isNumber } = require('lodash');

function getStages(testPath) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const { stages } = require(testPath);

    if (isArray(stages)) {
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
}

module.exports = {
    getStages
};
