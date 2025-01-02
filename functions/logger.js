module.exports = {
    /**
     * Logs INFO message to the terminal
     * @date 2025-01-01
     * @param {String} message Message to show in terminal
     * @returns {void}
     */
    info: (message) => {
        var timeString = new Date().toISOString();
        var prefix = `[${timeString}] \x1b[47mINFO:\x1b[0m `;
        console.log(prefix + message);
        return;
    },
    /**
     * Logs ERROR message to the terminal
     * @date 2025-01-01
     * @param {String} message Message to show in terminal
     * @returns {void}
    */
    error: (message) => {
        var timeString = new Date().toISOString();
        var prefix = `[${timeString}] \x1b[41mERROR:\x1b[0m `;
        console.log(prefix + message);
        return;
    },
    /**
     * Logs ROUTE message to the terminal
     * @date 2025-01-01
     * @param {String} message Message to show in terminal
     * @returns {void}
     */
    route: (message) => {
        var timeString = new Date().toISOString();
        var prefix = `[${timeString}] \x1b[42mROUTE:\x1b[0m `;
        console.log(prefix + message);
        return;
    },
}