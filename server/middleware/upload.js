const multer = require('multer');
const path = require('path');

// Dosyaların kaydedileceği klasör
const uploadDirectory = path.join(__dirname, '../uploads');

// Storage ayarları
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, uploadDirectory);
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Dosya yükleme için multer konfigürasyonu
const upload = multer({ storage: storage });

module.exports = upload;
