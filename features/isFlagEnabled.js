const flags = JSON.parse(require('fs').readFileSync(`${__dirname}/flags.json`));

/**
 * Returns boolean whetever certain flag is enabled
 * @date 2025-01-01
 * @param {String} flagIdentity Name of the flag
 * @returns {Boolean|undefined} Returns whetever flag is enabled or not
 */
module.exports = (flagIdentity) => {
    var flag = flags[flagIdentity];
    if (!flag)
        return undefined;

    if (typeof flag == 'boolean') return flag;
    return undefined;
}