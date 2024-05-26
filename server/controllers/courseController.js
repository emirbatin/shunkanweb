const Course = require("../models/courseModel.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    const coursesWithImageUrl = courses.map((course) => {
      const courseObject = course.toObject();
      if (courseObject.imagePath) {
        courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${courseObject.imagePath}`;
      }
      return courseObject;
    });
    res.status(200).json(coursesWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// Get single course
const getCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseObject = course.toObject();
    if (courseObject.imagePath) {
      courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${courseObject.imagePath}`;
    }

    res.status(200).json(courseObject);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

// Create course
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
      questions,
      imagePath
    });

    const courseObject = course.toObject();
    if (courseObject.imagePath) {
      courseObject.imageUrl = `${req.protocol}://${req.get("host")}/${courseObject.imagePath}`;
    }

    res.status(201).json(courseObject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.imagePath) {
      const filePath = path.resolve(__dirname, "..", course.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete the image file:", err);
          }
        });
      }
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course and related image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

// Update course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, minimumSkill, questions } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Course not found" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let update = { title, description, minimumSkill, questions };

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
  updateCourse
};
