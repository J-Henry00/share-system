var symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Returns random key to lock file
 * @date 2025-01-01
 * @returns {String}
 */
module.exports = () => {
    const timestamp = Date.now().toString() - 1735734020000;
    const randomPart = Array.from({ length: 6 }, () => symbols[Math.floor(Math.random() * symbols.length)]).join('');
    return `${timestamp}-${randomPart}`;
};