/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
    app.get('/ilikeit', (req, res) => {
        const url = req.query.url;
        if (!url) {
            res.status(400).json('missing query parameter: url');
            return;
        }
        /** @type import('./JobQueue') */
        const queue = global.queue;
        queue.push(url);
        res.json('task has been added');
    });
}