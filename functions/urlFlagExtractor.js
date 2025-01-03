/**
 * Returns extracted query string into an array
 * @date 2025-01-03
 * @param {String} query query string from express.js's req.query
 * @returns {String[]} returns extracted array of the query
 */
module.exports = (query) => {
    return query.split(',');
}