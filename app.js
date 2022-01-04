const path = require('path');
const fs = require('fs');

const route = require('./src/Route');
const { valid } = require('./config');
const { isFileExists } = require('./utils');

const init = async () => {
    const folders = [
        path.join(process.cwd(), 'cache'),
        path.join(process.cwd(), 'data')
    ];

    for (folder of folders) {
        const exists = await isFileExists(folder);
        if (!exists) fs.mkdirSync(folder)
    }

    const Provider = require('./src/Provider');
    const JobQueue = require('./src/JobQueue');

    Object.defineProperty(global, 'queue', {
        value: new JobQueue(),
        writable: false,
    })
    Object.defineProperty(global, 'provider', {
        value: new Provider(global.queue),
        writable: false,
    })

    global.queue.provider = global.provider;
}

const app = require('express')();
const port = 3000;

const run = async () => {
    await init();

    // middleware
    app.use((req, res, next) => {
        const secret = req.query.secret;
        if (!valid(secret)) {
            res.status(401).json('invalid secret');
            return;
        }
        next();
    });

    route(app);

    app.listen(port, () => {
        console.info('Listening at port: ' + port);
    });
}

run();