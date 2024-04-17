const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Question } = require('./questionModel');

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    minimumSkill: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    imagePath: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
