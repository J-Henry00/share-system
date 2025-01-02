/**
 * Returns object of file data using its searched key
 * @date 2025-01-01
 * @param {String} searchedKey File key to be found
 * @param {Object} fileList List of files
 * @returns {String|null} Returns file name or null if not found
 */
module.exports = (searchedKey, fileList) => {
    let response = null;

    Object.entries(fileList).forEach(([filename, data]) => {
        if (data.key === searchedKey)
            response = filename;
    });
    return response;
}