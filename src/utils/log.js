const debug = require('debug');

const debugKeyPrefix = 'warthog';

function customDebug(key, message) {
    debug(`${debugKeyPrefix}:${key}`)(message);
}

module.exports = {
    debug: customDebug
};
