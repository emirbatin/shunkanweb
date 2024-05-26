const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    termsandCondition: {
      type: Boolean,
      required: true,
      default: false,
    },
    cameraAccess: {
      type: Boolean,
      required: true,
      default: false,
    },
    plan: {
      type: String,
      required: true,
      enum: ["Free", "Premium"],
    },
    language: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: false,
    },
    bannerPath: {
      type: String,
      required: false,
    },
    emailConfirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
    role: {
      type: String,
      required: false,
      enum: ["user", "admin"],
      default: "user",
    },
    userMiskates: {
      type: Number,
      required: false,
      default: 0,
    },
    userCorrects: {
      type: Number,
      required: false,
      default: 0,
    },
    userOnline: {
      type: Boolean,
      required: false,
      default: false,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
    totalPoint: {
      type: Number,
      required: false,
      default: 0,
    },
    wrongAnswers: [
      {
        correctAns: { type: String, required: false },
        selectedAns: { type: String, required: false },
      },
    ],
    banned: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
