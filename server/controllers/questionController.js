const Question = require("../models/questionModel.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// get all questions

const getQuestions = async (req, res) => {
  const questions = await Question.find({}).sort({ createdAt: -1 });
  const questionsWithmediaUrl = questions.map((question) => {
    const questionObject = question.toObject();
    if (questionObject.mediaPath) {
      questionObject.mediaUrl = `${req.protocol}://${req.get("host")}/${
        questionObject.mediaPath
      }`;
    }
    return questionObject;
  });
  res.status(200).json(questionsWithmediaUrl);
};

// get single questions

const getQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Question not found" });
  }

  const question = await Question.findById(id);

  if (!question) {
    return res.status(400).json({ message: "Question not found" });
  }

  const questionObject = question.toObject();
  if (questionObject.mediaPath) {
    questionObject.mediaUrl = `${req.protocol}://${req.get("host")}/${
      questionObject.mediaPath
    }`;
  }

  res.status(200).json(question);
};

// create question

const createQuestion = async (req, res) => {
  // İlk mediaPath tanımını kaldırıyoruz
  const {
    questionText,
    options,
    correctAnswer,
    points,
    difficulty,
    mediaType,
  } = req.body;

  let mediaPath; // Dosya yolu için yerel bir değişken tanımlıyoruz
  if (req.file) {
    const uploadDir = "uploads";
    const fileName = path.basename(req.file.path);
    mediaPath = `${uploadDir}/${fileName}`; // Yüklenen dosyanın yolunu ayarlıyoruz
  }

  try {
    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      points,
      difficulty,
      mediaType,
      mediaPath: mediaPath, // Düzeltildi
    });

    const questionObject = question.toObject();
    if (questionObject.mediaPath) {
      questionObject.mediaUrl = `${req.protocol}://${req.get("host")}/${questionObject.mediaPath}`;
    }

    res.status(201).json(questionObject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// update question

const updateQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Question not found" });
  }

  const question = await Question.findById(id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // req.body'den mediaPath'i çıkarmamız gerekiyor çünkü onu kullanmıyoruz.
  let { mediaPath, ...updateData } = req.body;

  if (req.file) {
    const uploadDir = "uploads";
    const fileName = path.basename(req.file.path);
    mediaPath = `${uploadDir}/${fileName}`; // Doğru yolu kullan

    // Eğer eski dosya varsa, onu sil
    if (question.mediaPath) {
      const oldFilePath = path.join(__dirname, '..', question.mediaPath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Asenkron işlemi senkron yapmak için fs.unlinkSync kullanabilirsiniz
      }
    }
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { ...updateData, mediaPath: mediaPath }, // spread operatörü ile güncelleme verilerini ve yeni medya yolu
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Burada güncellenen soruyu döndürmeden önce mediaUrl'i ekleyin
    const updatedQuestionObject = updatedQuestion.toObject();
    if (updatedQuestionObject.mediaPath) {
      updatedQuestionObject.mediaUrl = `${req.protocol}://${req.get("host")}/${updatedQuestionObject.mediaPath}`;
    }

    res.status(200).json(updatedQuestionObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// delete question
const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Question not found" });
  }

  const question = await Question.findById(id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (question.mediaPath) {
    const filePath = path.resolve(__dirname, "..", question.mediaPath);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete the media file:", err);
        }
      });
    }
  }

  await Question.findByIdAndDelete(id);
  res.json({ message: "Question deleted successfully" });
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
