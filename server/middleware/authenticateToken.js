const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Token yoksa erişimi reddet

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı veritabanından bulun ve banlı olup olmadığını kontrol edin
    const user = await User.findById(decoded.id);
    if (!user || user.banned) {
      return res.sendStatus(403); // Kullanıcı banlıysa veya bulunamazsa erişimi reddet
    }

    req.user = user; // Kullanıcıyı request nesnesine ekleyin
    next(); // Token geçerliyse sonraki middleware'e geç
  } catch (err) {
    return res.sendStatus(403); // Token geçersizse erişimi reddet
  }
}

module.exports = authenticateToken; 
