const cheerio = require('cheerio');
const { Article } = require('./Article');

class ArticleNoLazy extends Article {
    /**
     * @param {Article} article
     */
    constructor(article) {
        super(article._target)
    }

    async html() {
        const html = await super.html();
        const $ = cheerio.load(html);
        $(`img`).each((i, elem) => {
            const src = $(elem).attr('data-src');
            if (!src) return;
            $(elem).attr('src', src.replace('https', 'http'));
        })
        return $.html();
    }
}

module.exports = {
    ArticleNoLazy
}