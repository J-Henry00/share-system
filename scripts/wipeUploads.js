const fs = require('fs');
const path = require('path');
const logger = require('../functions/logger');

const UPLOADS = path.join(__dirname, '..', 'uploads');
const FILES = path.join(__dirname, '..', 'files.json');

fs.readdirSync(UPLOADS).forEach(file => {
    if (file == '.gitkeep')
        return;

    fs.rmSync(path.join(UPLOADS, file));
});

logger.info('Uploads wipe complete..');

fs.writeFileSync(FILES, JSON.stringify({}));

logger.info('files.json wipe complete..');