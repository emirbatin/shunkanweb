const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Kullanıcı Kaydı
exports.createUser = async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    termsandConditions,
    cameraAccess,
    plan,
    role,
    language,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let imagePath, bannerPath;

    if (req.files) {
      const uploadDir = "uploads";

      // Handle profile image if uploaded
      if (req.files.image) {
        const imageFileName = path.basename(req.files.image[0].path);
        imagePath = `${uploadDir}/${imageFileName}`;
      }

      // Handle banner image if uploaded
      if (req.files.banner) {
        const bannerFileName = path.basename(req.files.banner[0].path);
        bannerPath = `${uploadDir}/${bannerFileName}`;
      }
    }

    const user = await User.create({
      language,
      name,
      username,
      email,
      password: hashedPassword,
      imagePath,
      bannerPath,
      termsandConditions,
      cameraAccess,
      plan,
      role,
    });

    const userObject = user.toObject();
    if (userObject.imagePath) {
      userObject.imageUrl = `${req.protocol}://${req.get("host")}/${
        userObject.imagePath
      }`;
    }
    if (userObject.bannerPath) {
      userObject.bannerUrl = `${req.protocol}://${req.get("host")}/${
        userObject.bannerPath
      }`;
    }

    res.status(201).json(userObject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (user) {
      if (user.banned) {
        return res
          .status(403)
          .send({ error: "This account banned from this website" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        // JWT token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        // Giriş başarılı, token ile birlikte kullanıcı bilgilerini döndür
        res.json({ user: user._id, token, message: "Logged in successfully" });
      } else {
        // Şifre eşleşmiyor
        res.status(400).send({ error: "Username or password is wrong" });
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

    const usersWithUrls = users.map((user) => {
      const userObject = user.toObject();
      if (userObject.imagePath) {
        userObject.imageUrl = `${req.protocol}://${req.get("host")}/${userObject.imagePath}`;
      }
      if (userObject.bannerPath) {
        userObject.bannerUrl = `${req.protocol}://${req.get("host")}/${userObject.bannerPath}`;
      }
      return userObject;
    });

    res.send(usersWithUrls);
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

    const userObject = user.toObject();
    if (userObject.imagePath) {
      userObject.imageUrl = `${req.protocol}://${req.get("host")}/${userObject.imagePath}`;
    }
    if (userObject.bannerPath) {
      userObject.bannerUrl = `${req.protocol}://${req.get("host")}/${userObject.bannerPath}`;
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

    if (req.files && req.files.image) {
      const oldImagePath = user.imagePath
        ? path.join(__dirname, "..", user.imagePath)
        : null;
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      const uploadDir = "uploads";
      const imageFileName = path.basename(req.files.image[0].path);
      user.imagePath = `${uploadDir}/${imageFileName}`;
      user.imageUrl = `${req.protocol}://${req.get("host")}/${user.imagePath}`;
    }

    if (req.files && req.files.banner) {
      const oldBannerPath = user.bannerPath
        ? path.join(__dirname, "..", user.bannerPath)
        : null;
      if (oldBannerPath && fs.existsSync(oldBannerPath)) {
        fs.unlinkSync(oldBannerPath);
      }
      const uploadDir = "uploads";
      const bannerFileName = path.basename(req.files.banner[0].path);
      user.bannerPath = `${uploadDir}/${bannerFileName}`;
      user.bannerUrl = `${req.protocol}://${req.get("host")}/${
        user.bannerPath
      }`;
    }

    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, saltRounds);
    }

    Object.keys(updates).forEach((update) => {
      if (update !== "password") user[update] = updates[update];
    });

    if (updates.wrongAnswers) {
      user.wrongAnswers = updates.wrongAnswers;
    }

    await user.save();
    const updatedUserObject = user.toObject();
    if (updatedUserObject.imagePath) {
      updatedUserObject.imageUrl = `${req.protocol}://${req.get("host")}/${
        updatedUserObject.imagePath
      }`;
    }
    if (updatedUserObject.bannerPath) {
      updatedUserObject.bannerUrl = `${req.protocol}://${req.get("host")}/${
        updatedUserObject.bannerPath
      }`;
    }

    res.status(200).json(updatedUserObject);
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

// Yanlış cevapların verilerini toplama

exports.addWrongAnswers = async (req, res) => {
  const { id } = req.params;
  const { wrongAnswers } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use $push to add new wrong answers to the array
    user.wrongAnswers.push(...wrongAnswers);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Kullanıcı puanlarını güncelleme
exports.addCoursePoints = async (req, res) => {
  const { id } = req.params;
  const { points } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.totalPoint += points;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
