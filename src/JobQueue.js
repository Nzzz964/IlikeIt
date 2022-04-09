const logger = require('../logger').logger('JobQueue');

class JobQueue {
    _queue
    _consumer

    constructor() {
        logger.info('被构造');
        this._queue = [];
    }

    /**
     * Push a new item to the queue
     * @param {string} target
     */
    push(target) {
        this._queue.push(target);
        logger.info(`添加了一个任务: ${target}`);
        this.notify();
    }

    /**
     * The service consumer will call pull() to get next item from the queue
     * @returns {string}
     */
    shift() {
        const job = this._queue.shift()
        if (!job) logger.info("任务队列已清空");
        return job;
    }

    set consumer(consumer) {
        this._consumer = consumer;
    }

    /**
    * Notify the service consumer a new item has been pushed
    */
    notify() {
        this._consumer?.consume();
    }
}

module.exports = {
    JobQueue
}