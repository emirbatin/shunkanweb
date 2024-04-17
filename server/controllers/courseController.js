const Course = require("../models/courseModel.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// get all courses

const getCourses = async (req, res) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });
  const coursesWithImageUrl = courses.map((course) => {
    const courseObject = course.toObject();
    if (courseObject.imagePath) {
      courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${
        courseObject.imagePath
      }`;
    }
    return courseObject;
  });
  res.status(200).json(coursesWithImageUrl);
};

// get single courses

const getCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(id);

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  const courseObject = course.toObject();
  if (courseObject.imagePath) {
    courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${
      courseObject.imagePath
    }`;
  }

  res.status(200).json(courseObject);
};

const createCourse = async (req, res) => {
  const { title, description, minimumSkill, questions } = req.body;

  let imagePath;
  if (req.file) {
    const uploadDir = 'uploads';
    const fileName = path.basename(req.file.path);
    imagePath = `${uploadDir}/${fileName}`;
  }

  try {
    const course = await Course.create({
      title,
      description,
      minimumSkill,
      questions, // Soruları ekleyin
      imagePath
    });

    const courseObject = course.toObject();
    if (courseObject.imagePath) {
      courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${courseObject.imagePath}`;
    }

    res.status(200).json(courseObject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// delete a course

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(id); // Önce kursu bulun

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Kursa ait resmi dosya sisteminden silin
  if (course.imagePath) {
    // Doğrudan course.imagePath'i kullanın
    fs.unlink(course.imagePath, (err) => {
      if (err) {
        // Dosya silinirken bir hata oluşursa loglayın (opsiyonel)
        console.error("Failed to delete the image file:", err);
      }
    });
  }

  // Kursu veritabanından silin
  await Course.findByIdAndDelete(id);

  res
    .status(200)
    .json({ message: "Course and related image deleted successfully" });
};

// update a course

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, minimumSkill, questions } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  try {
    let update = { title, description, minimumSkill, questions }; // Soruları da güncelle

    if (req.file) {
      if (course.imagePath) {
        const oldFilePath = path.join(__dirname, '..', course.imagePath);
        fs.unlink(oldFilePath, err => {
          if (err) {
            console.error("Failed to delete the old image file:", err);
          }
        });
      }
      const uploadDir = 'uploads';
      const fileName = path.basename(req.file.path);
      update.imagePath = `${uploadDir}/${fileName}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, update, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (updatedCourse.imagePath) {
      updatedCourse.imageUrl = `${req.protocol}://${req.get("host")}/${updatedCourse.imagePath}`;
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
};