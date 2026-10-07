const multer = require('multer');

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Unsupported file type.');
      err.code = 'UNSUPPORTED_FILE_TYPE';
      cb(err, false);
    }
  }
});

const uploadSingleFile = (fieldName = 'file') => {
  const uploader = upload.single(fieldName);

  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds 10 MB limit.' });
        }
        if (err.code === 'UNSUPPORTED_FILE_TYPE' || err.message === 'Unsupported file type.') {
          return res.status(400).json({ error: 'Unsupported file type.' });
        }
        return res.status(400).json({ error: err.message || 'File upload failed.' });
      }
      next();
    });
  };
};

module.exports = {
  upload,
  uploadSingleFile,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};
