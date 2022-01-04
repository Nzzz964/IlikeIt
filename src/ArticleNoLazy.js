const cheerio = require('cheerio');
const Article = require('./Article');

module.exports = class ArticleNoLazy extends Article {
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
            $(elem).attr('src', $(elem).attr('data-src'));
        })
        return $.html();
    }
}