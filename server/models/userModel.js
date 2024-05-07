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
      // Yüklenen resmin dosya yolunu saklamak için yeni alan
      type: String,
      required: false, // Resim yükleme opsiyonel olduğu için bu alan zorunlu olmayabilir
    },
    bannerPath: {
      // Yüklenen resmin dosya yolunu saklamak için yeni alan
      type: String,
      required: false, // Resim yükleme opsiyonel olduğu için bu alan zorunlu olmayabilir
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
