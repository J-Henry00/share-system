const path = require('path');
const fs = require('fs');

const JSON_PATH = path.join(__dirname, '..', 'files.json');

module.exports = {
    /**
     * Get array list of files
     * @date 2025-01-01
     * @returns {Object}
     */
    get: () => JSON.parse(fs.readFileSync(JSON_PATH)),
    /**
     * Saves new data to files.json
     * @date 2025-01-01
     * @param {String[]} data Array list of files
     * @returns {void}
     */
    set: (data) => fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2))
}