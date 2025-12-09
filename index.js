require('dotenv').config();

const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const fs = require('fs');
const QRCode = require('qrcode');
const os = require('os');

const isFlagEnabled = require('./features/isFlagEnabled');
const getFeatures = require('./features/getFeatureList');
const setFeatures = require('./features/setFeatureList');
const files = require('./functions/filesJson');
const fileName = require('./functions/fileName');
const logger = require('./functions/logger');
const getFileKey = require('./functions/keyGenerator');
const findFile = require('./functions/findFileUsingKey');
const getFileType = require('./functions/getFileType');
const extractFlags = require('./functions/urlFlagExtractor');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, fileName(file.originalname, files.get())),
});
const upload = multer({ storage });

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV == 'dev')
  app.use((req, _res, next) => {
    logger.route(
      `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    next();
  });
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { fileName: 'Share System' });
});

if (!isFlagEnabled('killUpload'))
  app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file)
      return res.status(400).json({ status: 400, error: 'No file uploaded' });

    const fileKey = getFileKey();
    let filesJson = files.get();
    filesJson[file.filename] = {
      uploadedAt: new Date().toISOString(),
      key: fileKey,
      type: file.mimetype,
    };
    files.set(filesJson);

    res.render('upload', {
      fileName: file.filename,
      fileKey,
      shareUrl: `${
        process.env.NODE_ENV == 'dev'
          ? `http://${getLocalIp()}:${PORT}`
          : 'https://share.hjindra.eu'
      }/view?key=${fileKey}`,
    });
  });
else app.post('/upload', (_req, res) => res.sendStatus(503));

app.get('/file/:fileName', (req, res) => {
  const { fileName } = req.params;
  const { key } = req.query;
  const fileData = files.get()[fileName];

  if (!fileData)
    return res.status(404).json({ status: 404, error: 'File not found' });

  if (key !== fileData.key)
    return res.status(403).json({ status: 403, error: 'Incorrect file key' });

  return res.sendFile(path.join(UPLOADS_DIR, fileName));
});

app.get('/download/:fileName', (req, res) => {
  const { fileName } = req.params;
  const { key } = req.query;
  const fileData = files.get()[fileName];

  if (!fileData)
    return res.status(404).json({ status: 404, error: 'File not found' });

  if (key !== fileData.key)
    return res.status(403).json({ status: 403, error: 'Incorrect file key' });

  return res.download(path.join(UPLOADS_DIR, fileName), fileName);
});

app.get('/view', (req, res) => {
  const { key } = req.query;

  if (!key) return res.sendStatus(400);

  const file = findFile(key, files.get());
  const fileData = files.get()[file];

  if (file == null) return res.sendStatus(404);

  var fileType = getFileType(fileData.type);

  var fileContent =
    fileType == 'text'
      ? fs.readFileSync(path.join(UPLOADS_DIR, file), 'utf-8')
      : `${
          process.env.NODE_ENV == 'dev'
            ? `http://${getLocalIp()}:${PORT}`
            : 'https://share.hjindra.eu'
        }/file/${file}?key=${key}`;

  res.render('file', {
    fileName: file,
    fileKey: key,
    fileType,
    fileContent,
    previewPdfFiles: isFlagEnabled(`PDFPreview`),
  });
});

app.get('/generate-qr-code', (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ status: 400, error: 'Key is required' });
  }

  var url = `${
    process.env.NODE_ENV == 'dev'
      ? `http://${getLocalIp()}:${PORT}`
      : 'https://share.hjindra.eu'
  }/view?key=${key}`;

  QRCode.toBuffer(url, (err, qrCodeDataUrl) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, error: 'Failed to generate QR code' });
    }
    return res.end(qrCodeDataUrl);
  });
});

app.get('/admin', (req, res) => {
  res.render('admin', { state: 'login', fileName: 'Log In' });
});

app.post('/admin', (req, res) => {
  const { username, password } = req.body;

  if (
    username == process.env.X_SHARE_SYSTEM_ADMIN &&
    password == process.env.X_SHARE_SYSTEM_PASSWORD
  ) {
    const features = getFeatures();
    const featureNames = Object.keys(features);
    const featureValues = Object.values(features);
    res.render('admin', {
      state: 'loggedIn',
      fileName: 'Admin Panel',
      username,
      password,
      featureNames,
      featureValues,
    });
  } else res.render('admin', { state: 'loginIncorrect', fileName: 'Log In' });
});

app.post('/admin/save', (req, res) => {
  let data = req.body;
  const features = getFeatures();
  if (
    data.username == process.env.X_SHARE_SYSTEM_ADMIN &&
    data.password == process.env.X_SHARE_SYSTEM_PASSWORD
  ) {
    delete data.username;
    delete data.password;

    Object.keys(features).forEach((n) => {
      switch (typeof features[n]) {
        case 'number':
          data[n] = Number(data[n]);
          break;
        case 'boolean':
          data[n] = data[n] == 'on';
          break;
        default:
          data[n] = data[n] == '' ? null : data[n];
          break;
      }
    });

    setFeatures(data);
    return res.status(200).redirect('/');
  } else res.sendStatus(403);
});

cron.schedule(`*/20 * * * *`, () => {
  const filesData = files.get();
  const now = Date.now();
  const updatedFiles = {};
  const removedFiles = [];

  Object.entries(filesData).forEach(([filename, data]) => {
    const fileTime = new Date(data.uploadedAt).getTime();
    if (now - fileTime > 60 * 60 * 1000) {
      if (fs.existsSync(path.join(UPLOADS_DIR, filename))) {
        fs.unlinkSync(path.join(UPLOADS_DIR, filename));
        removedFiles.push(filename);
      }
    } else {
      updatedFiles[filename] = data;
    }
  });

  files.set(updatedFiles);
  logger.info('Removed old files');
  if (process.env.NODE_ENV == 'dev') console.log(removedFiles);
});

app.listen(PORT, () => {
  logger.info(`Running ${process.env.NODE_ENV} environment on port ${PORT}`);
  logger.info(`Server is running with these flags:`);
  Object.entries(getFeatures()).forEach(([name, value]) => {
    console.log(`Flag "${name}" is set to "${value}"`);
  });
});
