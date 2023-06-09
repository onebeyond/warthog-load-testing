const { parentPort, workerData } = require('node:worker_threads');

function subscribeParent() {
    // This would notify us that the paren has updated the iterations
    parentPort.on('message', ({ iterations }) => {
        workerData.iterations = iterations;
    });
}

const notify = {
    finished: {
        lifecycle: {
            setup: () => parentPort.postMessage({ setupFinished: true })
        }
    }
};

module.exports = {
    subscribeParent,
    notify
};
