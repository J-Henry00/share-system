/**
 * Returns first possible file name if original is already present
 * @date 2025-01-01
 * @param {String} desiredFileName Desired name of the file
 * @param {String[]} fileList List of files
 * @returns {String} Returns name of a file which isnt present in the dir
 */
module.exports = (desiredFileName, fileList) => {
    if (!Object.keys(fileList).includes(desiredFileName))
        return desiredFileName;

    var ext = desiredFileName.split('.').pop();

    let i = 1;
    let name = `${desiredFileName.replace(`.${ext}`, '')}-${i}.${ext}`;

    while (Object.keys(fileList).includes(name)) {
        i++;
        name = `${desiredFileName.replace(`.${ext}`, '')}-${i}.${ext}`;
    }

    return name;
}