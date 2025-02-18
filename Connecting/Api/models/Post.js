const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      trim: true,
    },
    negativePrompt: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      trim: true,
    },
    quentity: {
      type: Number,
      trim: true,
    },
    style: {
      type: String,
      trim: true,
    },
    aiModal: {
      type: String,
      trim: true,
    },
    aiMage: [
      {
        type: String,
        required: false,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Posts = mongoose.model("Post", postSchema);

module.exports = Posts;
