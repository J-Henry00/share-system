const fs = require('fs');

const PATH = `${__dirname}/flags.json`;

/**
 * Saves new features
 * @date 2025-01-02
 * @param {Object} data data to be saved
 * @returns {void}
 */
module.exports = (data) => {
    fs.writeFileSync(PATH, JSON.stringify(data, null, 2));
    return;
}