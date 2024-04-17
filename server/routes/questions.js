const express = require("express");
const {
  createQuestion,
  deleteQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
} = require("../controllers/questionController");

const router = express.Router();

const upload = require("../middleware/upload");

router.post("/", upload.single("media"), createQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestion);
router.patch("/:id", upload.single("media"), updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
