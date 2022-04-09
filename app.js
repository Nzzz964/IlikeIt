const fs = require('fs');
const runtime = require('./runtime');

const { Route } = require('./src/Route');
const { valid } = require('./config');
const { logger } = require('./logger');

Object.values(runtime).forEach((v) => {
    if (!fs.existsSync(v)) fs.mkdirSync(v)
});

const app = require('express')();
const port = 3000;

// middleware
app.use((req, res, next) => {
    const secret = req.query.secret;
    if (!valid(secret)) {
        res.status(401).json('invalid secret');
        return;
    }
    next();
});

Route(app);

app.listen(port, () => {
    logger('App').info(`listening at port: ${port}`);
});