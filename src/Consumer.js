const os = require('os');
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const { Article } = require('./Article');
const { ArticleNoLazy } = require('./ArticleNoLazy');

const platform = os.platform();
let exec = path.join(process.cwd(), 'bin', 'wkhtmltopdf')
switch (platform) {
    case 'win32':
        exec = path.join(process.cwd(), 'bin', 'wkhtmltopdf.exe')
        break;
}

const { cache, data } = require('../runtime');

const logger = require('../logger').logger('Consumer');
class Consumer {
    /** @type {boolean} */
    _running = false;
    _queue

    constructor(queue) {
        logger.info('被构造');
        this._queue = queue;
    }

    /**
     * @param {string} target Queue data
     * @returns {Promise<void>}
     */
    async run() {
        try {
            if (this._running) return;

            this._running = true;
            const target = this._queue.shift();

            // queue is empty
            if (!target) {
                this._running = false;
                return;
            }

            const article = new Article(target);
            const noLazy = new ArticleNoLazy(article);
            const title = await noLazy.title();
            const html = await noLazy.html();

            const digest = Buffer.from(title)
                .toString('hex')
                .substring(0, 32)
                .padEnd(32, '0');

            const level1 = path.join(cache, digest.substring(0, 2));
            const level2 = path.join(level1, digest.substring(2, 4));

            fs.mkdirSync(level2, { recursive: true })

            // html save path
            const fph = path.join(level2, `${digest}.html`);
            fs.writeFileSync(fph, html);

            // pdf save path
            const fpp = path.join(data, `${title}.pdf`);

            logger.info(`"${title}" 正在处理`);

            await child.spawn(exec, [fph, fpp], {
                stdio: ['ignore', 'ignore', 'ignore']
            }).on('exit', () => {
                logger.info(`"${title}" 处理完成`);
                this._running = false;

                this.run();
            });
        } catch (err) {
            logger.error(err);
            this._running = false;
        }
    }

    /**
     * Receive the notify
     */
    consume() {
        this.run();
    }
}

module.exports = {
    Consumer
}