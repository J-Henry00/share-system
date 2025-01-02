const flags = require('./flags');

/**
 * Returns boolean whetever certain flag is enabled
 * @date 2025-01-01
 * @param {String} flagIdentity Name of the flag
 * @returns {Boolean} Returns whetever flag is enabled or not
 */
module.exports = (flagIdentity) => {
    var flag = flags[flagIdentity];

    if (typeof flag == 'boolean') return flag;
}