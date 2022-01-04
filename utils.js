const fs = require('fs');

module.exports = {
    /**
     * @param {fs.PathLike} path
     * @returns {Promise<boolean>}
     */
    isFileExists: (path) => {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, _) => {
                if (err == null) {
                    resolve(true);
                } else if (err.code === 'ENOENT') {
                    resolve(false);
                } else {
                    reject(err);
                }
            })
        })
    },
}