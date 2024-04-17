const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
    questionText: {
      type: String,
      required: true
    },
    options: [{
      label: { type: String, required: true },
      description: { type: String, required: true }
    }],
    correctAnswer: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 1
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: false
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      required: false,
      default: "none"
    },
    mediaPath: {
      type: String,
      required: function() { return this.mediaType !== "none"; }
    }
});

module.exports = mongoose.model("Question", questionSchema);
