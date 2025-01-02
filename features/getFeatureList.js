/**
 * Returns feature list
 * @date 2025-01-02
 * @returns {Object}
 */
module.exports = () => {
    return JSON.parse(require('fs').readFileSync(`${__dirname}/flags.json`));
}