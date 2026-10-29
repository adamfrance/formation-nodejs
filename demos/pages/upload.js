const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ALLOWED = new Map([
  ['image/png', '.png'],
  ['image/jpeg', '.jpg'],
  ['application/pdf', '.pdf'],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + ALLOWED.get(file.mimetype)),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, ALLOWED.has(file.mimetype)),
});

module.exports = { upload, UPLOAD_DIR };
