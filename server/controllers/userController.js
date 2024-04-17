const User = require("../models/userModel.js");
const bcrypt = require('bcrypt');
const fs = require("fs");
const path = require("path");
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// Kullanıcı Kaydı

exports.createUser = async (req, res) => {
  const { name, username, email, password, termsandConditions, cameraAccess, plan, role, language } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let imagePath;
    if (req.file) {
      const uploadDir = 'uploads';
      const fileName = path.basename(req.file.path);
      imagePath = `${uploadDir}/${fileName}`;
    }
    const user = await User.create({
      language,
      name,
      username,
      email,
      password: hashedPassword,
      imagePath,
      termsandConditions,
      cameraAccess,
      plan,
      role,
    });
    // Resim URL'sini oluşturun ve kullanıcı objesine ekleyin
    if (user.imagePath) {
      user.imageUrl = `${req.protocol}://${req.get("host")}/${user.imagePath}`;
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//Login User

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        // JWT token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        // Giriş başarılı, token ile birlikte kullanıcı bilgilerini döndür
        res.json({ user: user._id, token, message: "Logged in successfully" });
      } else {
        // Şifre eşleşmiyor
        res.status(400).send({ error: "Invalid login credentials" });
      }
    } else {
      // Kullanıcı bulunamadı
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
};

// Tüm Kullanıcıları Getir

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Kullanıcı ID'sine Göre Getir

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Kullanıcı objesine imageUrl alanı ekleyin
    const userObject = user.toObject();
    if (userObject.imagePath) {
      userObject.imageUrl = `${req.protocol}://${req.get("host")}/${userObject.imagePath}`;
    }
    res.send(userObject);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Kullanıcı Güncelleme

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updates = req.body;
    if (req.file) {
      // Eski resmi sil
      const oldFilePath = user.imagePath ? path.join(__dirname, '..', user.imagePath) : null;
      if (oldFilePath) {
        fs.unlink(oldFilePath, err => {
          if (err) console.error("Failed to delete the old image file:", err);
        });
      }
      // Yeni resim yolu
      const uploadDir = 'uploads';
      const fileName = path.basename(req.file.path);
      user.imagePath = `${uploadDir}/${fileName}`;
    }
    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, saltRounds);
    }
    // Diğer güncellemeler
    Object.keys(updates).forEach(update => {
      if (update !== 'password') user[update] = updates[update];
    });
    await user.save();
    // Resim URL'sini güncelle
    if (user.imagePath) {
      user.imageUrl = `${req.protocol}://${req.get("host")}/${user.imagePath}`;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Kullanıcı Silme

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    res.send({ user, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
