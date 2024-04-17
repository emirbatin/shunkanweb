const express = require("express");

const User = require("../models/userModel.js");
const userController = require('../controllers/userController');
const {
    createUser,
    loginUser,
    getUserById,
    getAllUsers,
    updateUser,
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
router.get("/", getAllUsers);

// GET a single user
router.get("/:id", getUserById); 

//Post a new user
router.post("/", upload.single('image'), createUser);

//Delete a user
router.delete("/:id", deleteUser);

//Update a user
router.patch("/:id", upload.single('image'), updateUser);

module.exports = router;



