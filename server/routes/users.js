const express = require("express");

const User = require("../models/userModel.js");
const userController = require('../controllers/userController');
const {
    createUser,
    loginUser,
    getUserById,
    getAllUsers,
    updateUser,
    addWrongAnswers,
    deleteUser
} = require("../controllers/userController");

const authenticateToken = require('../middleware/authenticateToken'); 

const upload = require("../middleware/upload");

const router = express.Router();

// Yeni login route'u
router.post('/login', userController.loginUser);

router.get("/secret", authenticateToken, (req, res) => {
    res.send("Gizli bilgi, sadece doğrulanmış kullanıcılar görebilir.");
});

// Kullanıcı register route'u
router.post('/register', userController.createUser);

//GET All Users
router.get('/', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// GET a single user
router.get("/:id", getUserById); 

//Post a new user
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), createUser);

//Update a user
router.patch("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateUser);

//Add wrong answers to a user
router.patch("/:id/addWrongAnswers", addWrongAnswers);

// Kullanıcıya kurs puanları ekleme
router.patch("/:id/addCoursePoints", userController.addCoursePoints);

//Delete a user
router.delete("/:id", deleteUser);

// Ban a user
router.patch("/:id/ban", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.banned = !user.banned;
      await user.save();
  
      res.json({ message: `User ${user.banned ? 'banned' : 'unbanned'}`, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
