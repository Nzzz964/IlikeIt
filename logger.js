const logger = (module) => {
    return {
        info: (message, ...optionalParams) => console.info(`${new Date().toLocaleString()} [INFO] ${module}: ${message}`, ...optionalParams),
        warn: (message, ...optionalParams) => console.warn(`${new Date().toLocaleString()} [WARN] ${module}: ${message}`, ...optionalParams),
        error: (message, ...optionalParams) => console.error(`${new Date().toLocaleString()} [ERROR] ${module}: ${message}`, ...optionalParams),
    }
}

module.exports = {
    logger
};