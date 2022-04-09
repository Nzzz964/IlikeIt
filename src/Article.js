const cheerio = require('cheerio');
const axios = require('axios').default;

class Article {
    /** @type {string} */
    _target

    /** @type {string} */
    _title
    /** @type {string} */
    _html

    constructor(target) {
        this._target = target;
    }

    /**
     * @returns {Promise<string>}
     */
    async html() {
        if (this._html) return this._html;
        await this._initWeb();
        return this._html;
    }

    /**
     * @returns {Promise<string>}
     */
    async title() {
        if (this._title) return this._title;
        await this._initWeb();
        return this._title;
    }

    /**
     * @returns {Promise<void>}
     */
    async _initWeb() {
        const res = await axios.get(this._target);
        this._html = res.data;
        const $ = cheerio.load(this._html);
        this._title = $(`[property='og:title']`).attr('content').trim();
    }
}

module.exports = {
    Article
}