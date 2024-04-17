// authenticateToken.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Token yoksa erişimi reddet

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token geçersizse erişimi reddet
    req.user = user;
    next(); // Token geçerliyse sonraki middleware'e geç
  });
}

module.exports = authenticateToken; // Middleware'i dışa aktar
