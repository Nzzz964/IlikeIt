module.exports = class JobQueue {
    /** @type {Array<string>} */
    _queue

    /** @type {import('./Provider')} */
    _provider

    constructor() {
        this._queue = [];
    }

    /**
     * Push a new item to the queue
     * @param {string} target
     */
    push(target) {
        this._queue.push(target);
        console.log('JobQueue: Pushed a job: ' + target);
        this.notify();
    }

    /**
     * The service provider will call pull() to get next item from the queue
     * @returns {string}
     */
    shift() {
        const job = this._queue.shift()
        if (job) console.log('JobQueue: Shifted a job: ' + job);
        return job;
    }

    /**
     * @param {import('./Provider')} provider
     */
    set provider(provider) {
        this._provider = provider;
    }

    /**
    * Notify the service provider a new item has been pushed
    */
    notify() {
        this._provider?.receive();
    }
}