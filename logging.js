function createLogger(app) {
    return {
        logDebug(message) {
            if (typeof app.debug === 'function') {
                app.debug(message);
            } else {
                console.debug('[debug]', message);
            }
        },

        logError(message) {
            if (typeof app.error === 'function') {
                app.error(message);
            } else {
                console.error('[error]', message);
            }

            if (typeof app.setPluginError === 'function') {
                app.setPluginError(message)
            }
        }
    };
}

module.exports = createLogger;