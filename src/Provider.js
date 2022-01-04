const os = require('os');
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const Article = require('./Article');
const ArticleNoLazy = require('./ArticleNoLazy');

const platform = os.platform();
let exec = path.join(process.cwd(), 'bin', 'wkhtmltopdf')
switch (platform) {
    case 'win32':
        exec = path.join(process.cwd(), 'bin', 'wkhtmltopdf.exe')
        break;
}

module.exports = class Provider {
    /** @type {boolean} */
    _running = false;
    /** @type {import('./JobQueue')} */
    _queue

    constructor(queue) {
        this._queue = queue;
    }

    /**
     * @param {string} target Queue data
     * @returns {Promise<void>}
     */
    async run() {
        if (this._running) return;

        this._running = true;
        const target = this._queue.shift();

        // queue is empty
        if (!target) {
            this._running = false;
            return;
        }

        console.log('Provider: Consuming a job: ' + target);

        const article = new Article(target);
        const noLazy = new ArticleNoLazy(article);
        const title = await noLazy.title();
        const html = await noLazy.html();

        const digest = Buffer.from(title)
            .toString('hex')
            .substring(0, 32)
            .padEnd(32, '0');

        const level1 = path.join(process.cwd(), 'cache', digest.substring(0, 2));
        const level2 = path.join(level1, digest.substring(2, 4));

        fs.mkdirSync(level2, { recursive: true })

        // html save path
        const fph = path.join(level2, `${title}.html`);
        fs.writeFileSync(fph, html);

        // pdf save path
        const fpp = path.join(process.cwd(), 'data', `${title}.pdf`);

        await child.spawn(exec, [fph, fpp], {
            stdio: ['ignore', 'ignore', 'ignore']
        }).on('exit', () => {
            console.log('Provider: Job: ' + target + ' has been converted to pdf');
            this._running = false;

            this.run().catch(() => {
                // ignore error
            })
        });

    }

    /**
     * Receive the notify
     */
    receive() {
        console.log('Provider: Func receive() has been called');
        this.run().catch((err) => {
            // ignore error
        });
    }
}