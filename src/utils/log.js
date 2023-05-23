const debug = require('debug');

const debugKeyPrefix = 'warthog';

function formattDebug(key, message) {
    debug(`${debugKeyPrefix}:${key}`)(message)
}

function customDebug(key, message) {
    if (key === 'os') {
        formattDebug(key, message)
    } else {
        formattDebug('other', message)
    }
}

module.exports = {
    debug: customDebug,
}