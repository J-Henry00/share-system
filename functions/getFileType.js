/**
 * Returns possible mime types for different content previews
 * @date 2025-01-01
 * @param {String} mimeType full mimeType (ex. text/plain, image/png, video/mp4)
 * @returns {String} returns 'text' if mimeType text/plain, 'image' if image, 'video' if video and 'unknown' for everything else
 */
module.exports = (mimeType) => {

    if (mimeType == 'text/plain')
        return 'text';

    let type = mimeType.split('/')[0];
    if (type == 'image' || type == 'video')
        return type;

    return 'unknown';
}