const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

router.post('/validate-token', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.banned) {
      return res.status(403).json({ valid: false, banned: user ? user.banned : null });
    }

    res.json({ valid: true, banned: false });
  } catch (err) {
    res.status(403).json({ valid: false });
  }
});

module.exports = router;
