const { jobQueueInstance } = require("../singleton");

const Route = (app) => {
    app.get('/ilikeit', (req, res) => {
        const url = req.query.url;
        if (!url) {
            res.status(400).json('missing query parameter: url');
            return;
        }
        jobQueueInstance.push(url);
        res.json('task has been added');
    });
}

module.exports = {
    Route
}